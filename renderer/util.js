export const to_radians = function(angle) {
    return angle * 2 * Math.PI / 360.0
}

export const multiply_matrices = function(a, b) {
    let c = []
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            c[i * 3 + j] = a[i * 3 + 0] * b[0 * 3 + j]
                + a[i * 3 + 1] * b[1 * 3 + j]
                + a[i * 3 + 2] * b[2 * 3 + j]
        }
    }
    return c
}