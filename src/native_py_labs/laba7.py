import matplotlib.pyplot as plt

# Данные
data = [
    (0.0, 1.0),
    (0.2, 1.0032),
    (0.4, 1.0512),
    (0.6, 1.2592),
    (0.8, 1.8292),
    (1.0, 3)
]

# Разделение данных на x и y
x_values, y_values = zip(*data)

# МНК для многочлена первой степени (P(x) = a*x + b)
n = len(x_values)
sum_x = sum(x_values)
sum_y = sum(y_values)
sum_x_squared = sum(x ** 2 for x in x_values)
sum_xy = sum(x * y for x, y in zip(x_values, y_values))

a = (n * sum_xy - sum_x * sum_y) / (n * sum_x_squared - sum_x ** 2)
b = (sum_y - a * sum_x) / n

# Вычисление суммы квадратов ошибок для многочлена первой степени
error_first_degree = sum((a * x + b - y) ** 2 for x, y in zip(x_values, y_values))

# МНК для многочлена второй степени (P(x) = c*x^2 + a*x + b)
sum_x_cubed = sum(x ** 3 for x in x_values)
sum_x_squared_y = sum(x ** 2 * y for x, y in zip(x_values, y_values))

c_numerator = (n * sum_x_squared_y - sum_x * sum_xy)
c_denominator = (n * sum_x_cubed - sum_x ** 2)

c = c_numerator / c_denominator

a_numerator = (sum_xy - c * sum_x_cubed)
a_denominator = (sum_x_squared - c * sum_x_squared)

a = a_numerator / a_denominator

b = (sum_y - c * sum_x_squared - a * sum_x) / n

# Вычисление суммы квадратов ошибок для многочлена второй степени
error_second_degree = sum((c * x ** 2 + a * x + b - y) ** 2 for x, y in zip(x_values, y_values))

# Вывод результатов
print("Коэффициенты многочлена первой степени (a*x + b):")
print(f"a = {a}, b = {b}")
print("Сумма квадратов ошибок для многочлена первой степени:", error_first_degree)

print("Коэффициенты многочлена второй степени (c*x^2 + a*x + b):")
print(f"a = {a}, b = {b}, c = {c}")
print("Сумма квадратов ошибок для многочлена второй степени:", error_second_degree)

# Графики
x_fit = [min(x_values) + i * 0.1 for i in range(int((max(x_values) - min(x_values)) / 0.1) + 1)]
y_fit_first_degree = [a * x + b for x in x_fit]
y_fit_second_degree = [c * x ** 2 + a * x + b for x in x_fit]

plt.scatter(x_values, y_values, label='Исходные данные')
plt.plot(x_fit, y_fit_first_degree, label='Многочлен первой степени', linestyle='--')
plt.plot(x_fit, y_fit_second_degree, label='Многочлен второй степени', linestyle='--')
plt.legend()
plt.title('Приближение многочленами первой и второй степени')
plt.xlabel('x')
plt.ylabel('y')
plt.show()

# 3.4

print("")

# Данные
data = [
    (-0.2, 1.7722),
    (0.0, 1.5708),
    (0.2, 1.3694),
    (0.4, 1.1593),
    (0.6, 0.9273)
]

# Разделение данных на x и y
x_values, y_values = zip(*data)

# Точка, в которой нужно вычислить производные
x_star = 1.0

# Вычисление первой производной (производной вперед)
f_prime = (y_values[x_values.index(x_star) + 1] - y_values[x_values.index(x_star)]) / (
        x_values[x_values.index(x_star) + 1] - x_values[x_values.index(x_star)])

# Вычисление второй производной (вторая разность)
f_double_prime = (y_values[x_values.index(x_star) + 1] - 2 * y_values[x_values.index(x_star)] + y_values[
    x_values.index(x_star) - 1]) / (x_values[x_values.index(x_star)] - x_values[x_values.index(x_star) - 1]) ** 2

# Вывод результатов
print("Первая производная в точке", x_star, "=", f_prime)
print("Вторая производная в точке", x_star, "=", f_double_prime)

# 3.5
print("")


def f(x):
    # Ваша функция
    return 1 / (3*x**2 + 4 * x + 2)


def rectangular_rule(f, a, b, h):
    # Метод прямоугольников
    n = int((b - a) / h)
    result = sum(f(a + i * h) for i in range(n))
    result *= h
    return result


def trapezoidal_rule(f, a, b, h):
    # Метод трапеций
    n = int((b - a) / h)
    result = (f(a) + f(b)) / 2.0
    for i in range(1, n):
        result += f(a + i * h)
    result *= h
    return result


def simpsons_rule(f, a, b, h):
    # Метод Симпсона
    n = int((b - a) / h)
    result = f(a) + f(b)
    for i in range(1, n, 2):
        result += 4 * f(a + i * h)
    for i in range(2, n - 1, 2):
        result += 2 * f(a + i * h)
    result *= h / 3.0
    return result


def runge_romberg_error_estimate(approx_value1, approx_value2, order):
    # Оценка погрешности методом Рунге-Ромберга
    return abs(approx_value1 - approx_value2) / (2 ** order - 1)


# Интервал интегрирования
X0 = -2.0
X1 = 2.0

# Шаги
h1 = 1.0
h2 = 0.5

# Применение методов интегрирования
integral_rectangular_1 = rectangular_rule(f, X0, X1, h1)
integral_rectangular_2 = rectangular_rule(f, X0, X1, h2)
integral_trapezoidal_1 = trapezoidal_rule(f, X0, X1, h1)
integral_trapezoidal_2 = trapezoidal_rule(f, X0, X1, h2)
integral_simpson_1 = simpsons_rule(f, X0, X1, h1)
integral_simpson_2 = simpsons_rule(f, X0, X1, h2)

# Оценка погрешности методом Рунге-Ромберга
error_rectangular = runge_romberg_error_estimate(integral_rectangular_1, integral_rectangular_2, 2)
error_trapezoidal = runge_romberg_error_estimate(integral_trapezoidal_1, integral_trapezoidal_2, 2)
error_simpson = runge_romberg_error_estimate(integral_simpson_1, integral_simpson_2, 4)

# Вывод результатов
print("Метод прямоугольников (h1):", integral_rectangular_1)
print("Метод прямоугольников (h2):", integral_rectangular_2, "Погрешность:", error_rectangular)

print("Метод трапеций (h1):", integral_trapezoidal_1)
print("Метод трапеций (h2):", integral_trapezoidal_2, "Погрешность:", error_trapezoidal)

print("Метод Симпсона (h1):", integral_simpson_1)
print("Метод Симпсона (h2):", integral_simpson_2, "Погрешность:", error_simpson)
