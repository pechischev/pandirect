class Coordinate {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    equals(coordinate: Coordinate): boolean {
        return (this.x == coordinate.x) && (this.y == coordinate.y);
    }
}

export = Coordinate;