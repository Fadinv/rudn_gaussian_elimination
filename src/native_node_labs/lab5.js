const f1 = (x1, x2, a) => (x1 ** 2 + a ** 2) * x2 - a ** 3;

const f2 = (x1, x2, a) => (x1 - a / 2) ** 2 + (x2 - a / 2) ** 2 - a ** 2;


const jacobian = (x1, x2, a) => {
    const df1_dx1 = 2 * x1 * x2;
    const df1_dx2 = x1 ** 2 + a ** 2;
    const df2_dx1 = 2 * (x1 - a / 2);
    const df2_dx2 = 2 * (x2 - a / 2);

    return [[df1_dx1, df1_dx2], [df2_dx1, df2_dx2]];
};


const newton_method = (x1, x2, a, epsilon = 1e-6, max_iter = 100) => {
    let result = null;
    for (let i = 0; i < max_iter; i++) {
        const F = [f1(x1, x2, a), f2(x1, x2, a)]
        const J = jacobian(x1, x2, a)
        const det = J[0][0] * J[1][1] - J[0][1] * J[1][0];

        if (Math.abs(det) < 1e-10) {
            x1 -= 0.1 * F[0];
            x2 -= 0.1 * F[1];
        } else {
            const J_inv = [[J[1][1] / det, -J[0][1] / det], [-J[1][0] / det, J[0][0] / det]];
            const delta = [-F[0], -F[1]];
            x1 += J_inv[0][0] * delta[0] + J_inv[0][1] * delta[1]
            x2 += J_inv[1][0] * delta[0] + J_inv[1][1] * delta[1]
        }


        if (Math.max(Math.abs(F[0]), Math.abs(F[1])) < epsilon) {
            result = [x1, x2];
            break;
        }
    }

    return result;
}


const simple_iteration_method = (x1, x2, a, epsilon = 1e-6, max_iter = 1000, lambda_val = 0.01) => {
    let result = null;
    for (let i = 1; i <= max_iter; i++) {
        const [x1_old, x2_old] = [x1, x2];
        const F = [f1(x1, x2, a), f2(x1, x2, a)];
        // Динамическое уменьшение шага
        lambda_val /= i;

        // Ограничим шаг, чтобы избежать переполнения
        x1 = Math.max(Math.min(x1 - lambda_val * F[0], 1e10), -1e10)
        x2 = Math.max(Math.min(x2 - lambda_val * F[1], 1e10), -1e10)

        // Проверим изменение переменных для оценки сходимости
        if (Math.abs(x1 - x1_old) < epsilon && Math.abs(x2 - x2_old) < epsilon) {
            result = [x1, x2];
            break;
        }
    }
    return result;
};


// Значения
const a = 2;
const [x1_initial, x2_initial] = [0.5, 0.5];

// Результаты
const [x1_newton, x2_newton] = newton_method(x1_initial, x2_initial, a);
console.log("Метод Ньютона:", x1_newton, x2_newton);

let max_iter = 1000;
let lambda_val = 0.01;
const [x1_iter, x2_iter] = simple_iteration_method(x1_initial, x2_initial, a, lambda_val, max_iter)
console.log("Метод простой итерации:", x1_iter, x2_iter);