namespace pixi_heaven.mesh {

	const DEFAULT_BORDER_SIZE = 10;

	/**
	 * The NineSlicePlane allows you to stretch a texture using 9-slice scaling. The corners will remain unscaled (useful
	 * for buttons with rounded corners for example) and the other areas will be scaled horizontally and or vertically
	 *
	 *```js
	 * let Plane9 = new PIXI.NineSlicePlane(PIXI.Texture.fromImage('BoxWithRoundedCorners.png'), 15, 15, 15, 15);
	 *  ```
	 * <pre>
	 *      A                          B
	 *    +---+----------------------+---+
	 *  C | 1 |          2           | 3 |
	 *    +---+----------------------+---+
	 *    |   |                      |   |
	 *    | 4 |          5           | 6 |
	 *    |   |                      |   |
	 *    +---+----------------------+---+
	 *  D | 7 |          8           | 9 |
	 *    +---+----------------------+---+

	 *  When changing this objects width and/or height:
	 *     areas 1 3 7 and 9 will remain unscaled.
	 *     areas 2 and 8 will be stretched horizontally
	 *     areas 4 and 6 will be stretched vertically
	 *     area 5 will be stretched both horizontally and vertically
	 * </pre>
	 *
	 * @class
	 * @extends PIXI.mesh.Plane
	 * @memberof PIXI.mesh
	 *
	 */
	export class NineSlicePlane extends Plane {
		/**
		 * The width of the left column (a)
		 *
		 * @member {number}
		 * @memberof PIXI.NineSlicePlane#
		 * @override
		 */
		_leftWidth: number;

		/**
		 * The width of the right column (b)
		 *
		 * @member {number}
		 * @memberof PIXI.NineSlicePlane#
		 * @override
		 */
		_rightWidth: number;

		/**
		 * The height of the top row (c)
		 *
		 * @member {number}
		 * @memberof PIXI.NineSlicePlane#
		 * @override
		 */
		_topHeight: number;

		/**
		 * The height of the bottom row (d)
		 *
		 * @member {number}
		 * @memberof PIXI.NineSlicePlane#
		 * @override
		 */
		_bottomHeight: number;

		/**
		 * @param {PIXI.Texture} texture - The texture to use on the NineSlicePlane.
		 * @param {int} [leftWidth=10] size of the left vertical bar (A)
		 * @param {int} [topHeight=10] size of the top horizontal bar (C)
		 * @param {int} [rightWidth=10] size of the right vertical bar (B)
		 * @param {int} [bottomHeight=10] size of the bottom horizontal bar (D)
		 */
		constructor(texture: PIXI.Texture, leftWidth = DEFAULT_BORDER_SIZE, topHeight = DEFAULT_BORDER_SIZE,
		            rightWidth = DEFAULT_BORDER_SIZE, bottomHeight = DEFAULT_BORDER_SIZE) {
			super(texture, 4, 4);


			this._leftWidth = leftWidth;

			/**
			 * The width of the right column (b)
			 *
			 * @member {number}
			 * @memberof PIXI.NineSlicePlane#
			 * @override
			 */
			this._rightWidth = rightWidth;

			/**
			 * The height of the top row (c)
			 *
			 * @member {number}
			 * @memberof PIXI.NineSlicePlane#
			 * @override
			 */
			this._topHeight = topHeight;

			/**
			 * The height of the bottom row (d)
			 *
			 * @member {number}
			 * @memberof PIXI.NineSlicePlane#
			 * @override
			 */
			this._bottomHeight = bottomHeight;

			this.refresh(true);
		}

		/**
		 * The width of the left column
		 *
		 * @member {number}
		 */
		get leftWidth() {
			return this._leftWidth;
		}

		set leftWidth(value) // eslint-disable-line require-jsdoc
		{
			if (this._leftWidth === value) {
				return;
			}
			this._leftWidth = value;
			this._verticesID++;
		}

		/**
		 * The width of the right column
		 *
		 * @member {number}
		 */
		get rightWidth() {
			return this._rightWidth;
		}

		set rightWidth(value) // eslint-disable-line require-jsdoc
		{
			if (this._rightWidth === value) {
				return;
			}
			this._rightWidth = value;
			this._verticesID++;
		}

		/**
		 * The height of the top row
		 *
		 * @member {number}
		 */
		get topHeight() {
			return this._topHeight;
		}

		set topHeight(value) // eslint-disable-line require-jsdoc
		{
			if (this._topHeight === value) {
				return;
			}
			this._topHeight = value;
			this._verticesID++;
		}

		/**
		 * The height of the bottom row
		 *
		 * @member {number}
		 */
		get bottomHeight() {
			return this._bottomHeight;
		}

		set bottomHeight(value) // eslint-disable-line require-jsdoc
		{
			if (this._bottomHeight === value) {
				return;
			}
			this._bottomHeight = value;
			this._verticesID++;
		}

		/**
		 * refreshes both vertices and uvs
		 *
		 * @private
		 */
		_refreshVertices() {
			this.updateHorizontalVertices();
			this.updateVerticalVertices();

			const vertices = this.vertices;
			const anchor = this._anchor as any;
			const offsetX = anchor._x * this.width;
			const offsetY = anchor._y * this.height;

			for (let i = 0; i < 32; i += 2) {
				vertices[i] += offsetX;
				vertices[i + 1] += offsetY;
			}
			this.dirty++;
		}

		/**
		 * does nothing
		 *
		 * @private
		 */
		_refreshUvs() {
			this._uvsID = this._lastUvsID;

			const uvs = this.uvs;
			const texture = this._texture;
			const width = texture.orig.width;
			const height = texture.orig.height;

			uvs[0] = uvs[8] = uvs[16] = uvs[24] = 0;
			uvs[2] = uvs[10] = uvs[18] = uvs[26] = this._leftWidth / width;
			uvs[4] = uvs[12] = uvs[20] = uvs[28] = 1 - (this._rightWidth / width);
			uvs[6] = uvs[14] = uvs[22] = uvs[30] = 1;

			uvs[1] = uvs[3] = uvs[5] = uvs[7] = 0;
			uvs[9] = uvs[11] = uvs[13] = uvs[15] = this._topHeight / height;
			uvs[17] = uvs[19] = uvs[21] = uvs[23] = 1 - (this._bottomHeight / height);
			uvs[25] = uvs[27] = uvs[29] = uvs[31] = 1;

			this.dirty++;

			this.multiplyUvs();
		}

		/**
		 * Updates the horizontal vertices.
		 */
		updateHorizontalVertices() {
			const vertices = this.vertices;

			vertices[1] = vertices[3] = vertices[5] = vertices[7] = 0;
			vertices[9] = vertices[11] = vertices[13] = vertices[15] = this._topHeight;
			vertices[17] = vertices[19] = vertices[21] = vertices[23] = this._height - this._bottomHeight;
			vertices[25] = vertices[27] = vertices[29] = vertices[31] = this._height;
		}

		/**
		 * Updates the vertical vertices.
		 *
		 */
		updateVerticalVertices() {
			const vertices = this.vertices;

			vertices[0] = vertices[8] = vertices[16] = vertices[24] = 0;
			vertices[2] = vertices[10] = vertices[18] = vertices[26] = this._leftWidth;
			vertices[4] = vertices[12] = vertices[20] = vertices[28] = this._width - this._rightWidth;
			vertices[6] = vertices[14] = vertices[22] = vertices[30] = this._width;
		}

		/**
		 * Renders the object using the Canvas renderer
		 *
		 * @private
		 * @param {PIXI.CanvasRenderer} renderer - The canvas renderer to render with.
		 */
		_renderCanvas(renderer: PIXI.CanvasRenderer) {
			// no texture - no drawImage
			if (!this._texture.valid) {
				return;
			}

			// advanced rendering - allow texture rotates
			if (this._texture.rotate) {
				super._renderCanvas(renderer);

				return;
			}

			const context = renderer.context;

			context.globalAlpha = this.worldAlpha;

			const transform = this.worldTransform;
			const res = renderer.resolution;

			if (renderer.roundPixels) {
				context.setTransform(
					transform.a * res,
					transform.b * res,
					transform.c * res,
					transform.d * res,
					(transform.tx * res) | 0,
					(transform.ty * res) | 0
				);
			}
			else {
				context.setTransform(
					transform.a * res,
					transform.b * res,
					transform.c * res,
					transform.d * res,
					transform.tx * res,
					transform.ty * res
				);
			}

			const base = this._texture.baseTexture;
			const textureSource = base.source;
			const w = base.realWidth;
			const h = base.realHeight;

			this.drawSegment(context, textureSource, w, h, 0, 1, 10, 11);
			this.drawSegment(context, textureSource, w, h, 2, 3, 12, 13);
			this.drawSegment(context, textureSource, w, h, 4, 5, 14, 15);
			this.drawSegment(context, textureSource, w, h, 8, 9, 18, 19);
			this.drawSegment(context, textureSource, w, h, 10, 11, 20, 21);
			this.drawSegment(context, textureSource, w, h, 12, 13, 22, 23);
			this.drawSegment(context, textureSource, w, h, 16, 17, 26, 27);
			this.drawSegment(context, textureSource, w, h, 18, 19, 28, 29);
			this.drawSegment(context, textureSource, w, h, 20, 21, 30, 31);
		}

		/**
		 * Renders one segment of the plane.
		 * to mimic the exact drawing behavior of stretching the image like WebGL does, we need to make sure
		 * that the source area is at least 1 pixel in size, otherwise nothing gets drawn when a slice size of 0 is used.
		 *
		 * @private
		 * @param {CanvasRenderingContext2D} context - The context to draw with.
		 * @param {CanvasImageSource} textureSource - The source to draw.
		 * @param {number} w - width of the texture
		 * @param {number} h - height of the texture
		 * @param {number} x1 - x index 1
		 * @param {number} y1 - y index 1
		 * @param {number} x2 - x index 2
		 * @param {number} y2 - y index 2
		 */
		drawSegment(context: CanvasRenderingContext2D, textureSource: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement,
		            w: number, h: number, x1: number, y1: number, x2: number, y2: number) {
			// otherwise you get weird results when using slices of that are 0 wide or high.
			const uvs = this.uvs;
			const vertices = this.vertices;

			let sw = (uvs[x2] - uvs[x1]) * w;
			let sh = (uvs[y2] - uvs[y1]) * h;
			let dw = vertices[x2] - vertices[x1];
			let dh = vertices[y2] - vertices[y1];

			// make sure the source is at least 1 pixel wide and high, otherwise nothing will be drawn.
			if (sw < 1) {
				sw = 1;
			}

			if (sh < 1) {
				sh = 1;
			}

			// make sure destination is at least 1 pixel wide and high, otherwise you get
			// lines when rendering close to original size.
			if (dw < 1) {
				dw = 1;
			}

			if (dh < 1) {
				dh = 1;
			}

			context.drawImage(textureSource, uvs[x1] * w, uvs[y1] * h, sw, sh, vertices[x1], vertices[y1], dw, dh);
		}
	}
}
