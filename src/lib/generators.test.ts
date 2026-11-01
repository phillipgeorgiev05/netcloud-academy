import { describe, expect, it } from 'vitest';
import { compressIPv6, eui64, normalizeIPv6, parseIPv6 } from './ipv6';
import { evaluateIam, evaluateNsg, fieldMatches, generate, generatorNames, stpSolve } from './generators';
import type { GeneratorId } from '../types/content';

describe('ipv6', () => {
  it('RFC-5952-Kürzung', () => {
    expect(compressIPv6(parseIPv6('2001:0db8:0000:0000:0000:ff00:0042:8329')!)).toBe('2001:db8::ff00:42:8329');
    expect(compressIPv6(parseIPv6('2001:db8:0:0:1:0:0:1')!)).toBe('2001:db8::1:0:0:1'); // erste von zwei gleich langen
    expect(compressIPv6(parseIPv6('2001:db8:0:1:1:1:1:1')!)).toBe('2001:db8:0:1:1:1:1:1'); // einzelne 0 nicht kürzen
    expect(compressIPv6(parseIPv6('::')!)).toBe('::');
  });

  it('ungültige Eingaben', () => {
    expect(parseIPv6('2001:db8::ab::1')).toBeNull();
    expect(parseIPv6('2001:db8:::1')).toBeNull();
    expect(parseIPv6('12345::1')).toBeNull();
    expect(normalizeIPv6('2001:DB8:0::1/64')).toBe('2001:db8::1/64');
  });

  it('EUI-64', () => {
    expect(eui64('00:1a:2b:3c:4d:5e').map((x) => x.toString(16).padStart(4, '0')).join(':')).toBe('021a:2bff:fe3c:4d5e');
  });
});

describe('Auswerter', () => {
  it('NSG: niedrigste Priorität gewinnt, sonst Standardregeln', () => {
    const rules = [
      { prio: 100, name: 'deny-rdp', source: 'Internet', port: 3389, action: 'Deny' as const },
      { prio: 200, name: 'allow-rdp', source: 'Any', port: 3389, action: 'Allow' as const },
    ];
    expect(evaluateNsg(rules, '203.0.113.5', 'Internet', 3389).name).toBe('deny-rdp');
    expect(evaluateNsg(rules, '10.0.0.5', 'VirtualNetwork', 3389).name).toBe('allow-rdp');
    expect(evaluateNsg(rules, '10.0.0.5', 'VirtualNetwork', 443).name).toBe('AllowVNetInBound');
    expect(evaluateNsg(rules, '203.0.113.5', 'Internet', 443).name).toBe('DenyAllInBound');
  });

  it('IAM: explizites Deny > SCP > Allow > implizit', () => {
    expect(evaluateIam([{ effect: 'Allow', action: 's3:*' }, { effect: 'Deny', action: 's3:DeleteObject' }], [], null, 's3:DeleteObject').reason).toBe('Explizites Deny');
    expect(evaluateIam([{ effect: 'Allow', action: '*' }], [], ['s3:*'], 'ec2:StartInstances').reason).toBe('SCP erlaubt es nicht');
    expect(evaluateIam([{ effect: 'Allow', action: 's3:Get*' }], [], null, 's3:GetObject').result).toBe('Allow');
    expect(evaluateIam([], [], null, 's3:GetObject').reason).toBe('Kein Allow (implizites Deny)');
  });

  it('STP: Priorität vor MAC, Root Port nach Kosten', () => {
    const sw = [
      { id: 'SW1', prio: 32768, mac: '0000.0c00.000b' },
      { id: 'SW2', prio: 32768, mac: '0000.0c00.000a' },
      { id: 'SW3', prio: 28672, mac: '0000.0c00.00ff' },
    ];
    const links = [
      { a: 'SW1', b: 'SW2', aPort: 'Gi0/1', bPort: 'Gi0/1', cost: 4, label: '1G' },
      { a: 'SW2', b: 'SW3', aPort: 'Gi0/2', bPort: 'Gi0/1', cost: 19, label: '100M' },
      { a: 'SW3', b: 'SW1', aPort: 'Gi0/2', bPort: 'Gi0/2', cost: 4, label: '1G' },
    ];
    const r = stpSolve(sw, links);
    expect(r.root.id).toBe('SW3');
    expect(r.rootPort('SW2').port).toBe('Gi0/1'); // über SW1: 4 + 4 = 8 < 19
  });
});

describe('Generatoren', () => {
  it('jeder Generator liefert lösbare Aufgaben (Lösung passt zu sich selbst)', () => {
    for (const id of Object.keys(generatorNames) as GeneratorId[])
      for (let i = 0; i < 200; i++) {
        const p = generate(id);
        expect(p.fields.length).toBeGreaterThan(0);
        for (const f of p.fields) {
          expect(fieldMatches(f, f.answer)).toBe(true);
          if (f.options) expect(f.options).toContain(f.answer);
        }
      }
  });

  it('Zahlen tolerant im deutschen Format', () => {
    const f = { label: 'x', answer: '1234.50', kind: 'number' as const, tolerance: 0.01 };
    expect(fieldMatches(f, '1.234,50 €')).toBe(true);
    expect(fieldMatches(f, '1234,5')).toBe(true);
    expect(fieldMatches(f, '1234')).toBe(false);
  });
});
