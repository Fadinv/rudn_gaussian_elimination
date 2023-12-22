const x_start = 0, y_start = 1.5, x_end = 1, h = 0.1;

// Точное решение
const exact_solution = (x) => (2.71828 ** x) / 2 + (2.71828 ** -x);

// Функция правой части уравнения
const f = (x, y) => -y + (2.71828 ** x);

// Метод Эйлера
const euler_method = (x_start, y_start, x_end, h) => {
    const x_values = [x_start];
    const y_values = [y_start];

    while (x_values[x_values.length - 1] < x_end) {
        const x_new = +(x_values[x_values.length - 1] + h).toFixed(5);
        const y_new = +(y_values[y_values.length - 1] + h * f(x_values[x_values.length - 1], y_values[y_values.length - 1])).toFixed(5);
        x_values.push(x_new);
        y_values.push(y_new);
    }

    return [x_values, y_values];
};

// Метод Рунге-Кутты 4-го порядка
const runge_kutta_method = (x_start, y_start, x_end, h) => {
    const x_values = [x_start]
    const y_values = [y_start]

    while (x_values[x_values.length - 1] < x_end) {
        const x_current = x_values[x_values.length - 1];
        const y_current = y_values[y_values.length - 1];

        const k1 = +(h * f(x_current, y_current)).toFixed(5);
        const k2 = +(h * f(x_current + h / 2, y_current + k1 / 2)).toFixed(5);
        const k3 = +(h * f(x_current + h / 2, y_current + k2 / 2)).toFixed(5);
        const k4 = +(h * f(x_current + h, y_current + k3)).toFixed(5);

        const x_new = +(x_current + h).toFixed(5);
        const y_new = +(y_current + (k1 + 2 * k2 + 2 * k3 + k4) / 6).toFixed(5);

        x_values.push(x_new);
        y_values.push(y_new);
    }

    return [x_values, y_values];
};


console.log("Метод Эйлера:");
const [euler_x, euler_y] = euler_method(x_start, y_start, x_end, h);
euler_x.forEach((x, i) => {
    const y = euler_y[i];
    console.log(`x = ${x}, y = ${y}`);
});

console.log("\nМетод Рунге-Кутты 4-го порядка:");
const [runge_kutta_x, runge_kutta_y] = runge_kutta_method(x_start, y_start, x_end, h);
runge_kutta_x.forEach((x, i) => {
    const y = runge_kutta_y[i];
    console.log(`x = ${x}, y = ${y}`);
});
