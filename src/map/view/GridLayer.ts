import * as Konva from "konva";
import { Coordinate } from "common/math/Coordinate";
import { Creator } from "map/view/item/Creator";
import { MovementController } from "map/controller/MovementController";
import { Layer } from "common/canvas/Layer";

export class GridLayer extends Layer {
	readonly clickItemEvent = this.createDispatcher();
	private _cell = new Creator();

	constructor() {
		super();
		this._cell.setSize({width: MovementController.CELL_WIDTH, height: MovementController.CELL_HEIGHT});
		this._cell.on("click", (event) => {
			event.cancelBubble = true;
			this.clickItemEvent.dispatch(new Coordinate(this._cell.x(), this._cell.y()));
		});
		this._layer.add(this._cell);
		this._layer.draw();
	}

	updateCellPosition(pos: Coordinate) {
		this._layer.removeChildren();
		this.renderGrid();
		this._cell.position(MovementController.toAbsolute(pos));
		this._layer.add(this._cell);
		this._layer.batchDraw();
	}

	showCell(show: boolean) {
		this._cell.visible(show);
		this._layer.batchDraw();
	}

	private renderGrid() {
		const size = this._layer.getSize();
		const columns = Math.ceil(size.width / MovementController.CELL_WIDTH);
		const rows = Math.ceil(size.height / MovementController.CELL_HEIGHT);
		for (let y = 0; y < rows; ++y) {
			for (let x = 0; x < columns; ++x) {
				const position = MovementController.toAbsolute(new Coordinate(x, y));
				this._layer.add(new Konva.Rect({
					width: MovementController.CELL_WIDTH,
					height: MovementController.CELL_HEIGHT,
					x: position.x,
					y: position.y,
					strokeWidth: 1,
					stroke: "#F0F4F7"
				}));
			}
		}
	}
}