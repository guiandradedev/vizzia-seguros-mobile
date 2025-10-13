export function formatCEP(value: string) {
    const v = value.replace(/\D/g, '').slice(0, 8);
    return v.replace(/(\d{5})(\d{0,3})/, '$1-$2').replace(/-$/, '');
}

export function isValidCEP(cep: string) {
    if (typeof cep !== 'string') return false;
    const cleaned = cep.replace(/\D/g, '');
    return cleaned.length === 8;
}

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

export function formatCNH(value: string) {
    const v = value.replace(/\D/g, '').slice(0, 11);
    return v
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

export function isValidCNH(cnh: string) {
    return true
    // if (typeof cnh !== "string") return false;
    // cnh = cnh.replace(/[^\d]+/g, "");
    // if (cnh.length !== 11 || !!cnh.match(/(\d)\1{10}/)) return false;
    // const cnhDigits = cnh.split("").map((el) => +el);
    
    // // Primeiro dígito verificador
    // let sum = 0;
    // for (let i = 0; i < 9; i++) {
    //     sum += cnhDigits[i] * (9 - i);
    // }
    // let firstVerifier = sum % 11;
    // if (firstVerifier === 10) firstVerifier = 0;
    // if (firstVerifier !== cnhDigits[9]) return false;
    
    // // Segundo dígito verificador
    // sum = 0;
    // for (let i = 0; i < 10; i++) {
    //     sum += cnhDigits[i] * (i + 1);
    // }
    // let secondVerifier = sum % 11;
    // if (secondVerifier === 10) secondVerifier = 0;
    // return secondVerifier === cnhDigits[10];
}