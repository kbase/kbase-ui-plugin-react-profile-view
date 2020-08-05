export function arraysEqual(a: any, b: any): boolean {
    if (!Array.isArray(a)) {
        return false;
    }
    if (!Array.isArray(b)) {
        return false;
    }

    if (a.length !== b.length) {
        return false;
    }
    for (let i = 0; i < a.length; i += 1) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
}