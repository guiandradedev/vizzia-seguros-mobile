export function formatCPF(value: string) {
    const v = value.replace(/\D/g, '').slice(0, 11);
    return v
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

export function formatPhone(value: string) {
    const v = value.replace(/\D/g, '').slice(0, 11);
    if (v.length <= 10) {
        // (XX) XXXX-XXXX
        return v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
    }
    // (XX) XXXXX-XXXX
    return v.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
}

export function isValidEmail(email: string) {
    if (typeof email !== 'string') return false;
    // simple RFC-like email regex (sufficient for basic validation)
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    return re.test(email);
}

export function isValidCPF(cpf: string) {
    if (typeof cpf !== "string") return false;
    cpf = cpf.replace(/[^\d]+/g, "");
    if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
    const cpfDigits = cpf.split("").map((el) => +el);
    const rest = (count: number): number => {
        return (((cpfDigits.slice(0, count - 12).reduce((soma, el, index) => soma + el * (count - index), 0) * 10) % 11) % 10);
    };
    return rest(10) === cpfDigits[9] && rest(11) === cpfDigits[10];
}