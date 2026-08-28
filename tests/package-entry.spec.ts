import { describe, expect, it } from 'vitest';

describe('package entry', () => {
    it('exports something', async () => {
        const mod = await import('../lib/index.js');
        expect(Object.keys(mod).length).toBeGreaterThan(0);
    });

    it('exports ValidationPipe, RequestDto and ParentDto', async () => {
        const mod = await import('../lib/index.js');
        expect(typeof mod.ValidationPipe).toBe('function');
        expect(typeof mod.RequestDto).toBe('function');
        expect(typeof mod.ParentDto).toBe('function');
        expect(typeof mod.AddRequestToBody).toBe('function');
    });
});
