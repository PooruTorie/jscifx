import CifX_impl, {BOARD_INFORMATION, CHANNEL_INFORMATION, CIFX_IO_WAIT_TIMEOUT, CIFXHANDLE, DRIVER_INFORMATION} from "./impl/CifX";
import {CURRENT_PLATFORM} from "./loader";
import {CIFX_NO_ERROR, CifXError} from "./impl/Errors";
import * as koffi from "koffi";

export class CifX {
	private static _initialized = false;

	static init() {
		if (this._initialized) {
			throw new CifXError("CifX is already initialized.", 0);
		}
		if (CURRENT_PLATFORM === "linux") {
			const ret = CifX_impl.init();
			if (ret != CIFX_NO_ERROR) {
				throw new CifXError("CifX initialization failed", ret);
			}
		}
		this._initialized = true;
	}

	static deinit() {
		if (!this._initialized) {
			throw new CifXError("CifX not initialized.", 0);
		}
		if (CURRENT_PLATFORM === "linux") {
			const ret = CifX_impl.deinit();
			if (ret != CIFX_NO_ERROR) {
				throw new CifXError("CifX deinitialization failed", ret);
			}
		}
		this._initialized = false;
	}

	static get initialized(): boolean {
		return this._initialized;
	}

	static openDriver() {
		if (!this._initialized) {
			throw new CifXError("CifX not initialized. Call CifX.init() first.", 0);
		}
		const deviceHandle = [[null]];
		const ret = CifX_impl.openDriver(deviceHandle);
		if (ret != CIFX_NO_ERROR) {
			throw new CifXError("CifX driver open failed", ret);
		}
		return new Driver(deviceHandle[0]);
	}
}

export class Driver {

	private info_cache: DRIVER_INFORMATION | null = null;

	constructor(readonly handle: CIFXHANDLE) {

	}

	close() {
		const ret = CifX_impl.closeDriver(this.handle);
		if (ret != CIFX_NO_ERROR) {
			throw new CifXError("CifX driver close failed", ret);
		}
	}

	protected get info(): DRIVER_INFORMATION {
		let info: DRIVER_INFORMATION = {};
		if (this.info_cache) {
			info = this.info_cache;
		} else {
			const ret = CifX_impl.getInfo(this.handle, koffi.sizeof(DRIVER_INFORMATION), info);
			if (ret != CIFX_NO_ERROR) {
				throw new CifXError("CifX get version failed", ret);
			}
			this.info_cache = info;
		}
		return info;
	}

	get version(): string {
		if (CURRENT_PLATFORM === "linux") {
			const version = Buffer.alloc(32);
			const ret = CifX_impl.getVersion(version.length, version);
			if (ret != CIFX_NO_ERROR) {
				throw new CifXError("CifX get version failed", ret);
			}
			return String(version).replace(/\0/g, "");
		} else {
			const info: DRIVER_INFORMATION = this.info;
			return info.driverVersion;
		}
	}

	get boardCount(): number {
		const info: DRIVER_INFORMATION = this.info;
		return info.boardCount;
	}

	getBoard(index: number): Board {
		if (index < 0 || index >= this.boardCount) {
			throw new CifXError(`Invalid board index: ${index}`, 0);
		}
		let info: BOARD_INFORMATION = {};
		const ret = CifX_impl.getBoard(this.handle, index, koffi.sizeof(BOARD_INFORMATION), info);
		if (ret != CIFX_NO_ERROR) {
			throw new CifXError("CifX get board failed", ret);
		}
		return new Board(this, index, info);
	}

	* enumerateBoards(): Generator<Board> {
		for (let i = 0; i < this.boardCount; i++) {
			yield this.getBoard(i);
		}
	}

}

export class Board {
	constructor(readonly driver: Driver, readonly boardIndex: number, private readonly boardInfo: BOARD_INFORMATION) {

	}

	get channelCount(): number {
		return this.boardInfo.channelCount;
	}

	getChannel(index: number): Channel {
		if (index < 0 || index >= this.channelCount) {
			throw new CifXError(`Invalid channel index: ${index}`, 0);
		}
		let info: CHANNEL_INFORMATION = {};
		const ret = CifX_impl.getChannel(this.driver.handle, this.boardIndex, index, koffi.sizeof(CHANNEL_INFORMATION), info);
		if (ret != CIFX_NO_ERROR) {
			throw new CifXError("CifX get channel failed", ret);
		}
		return new Channel(this, index, info);
	}

	* enumerateChannels(): Generator<Channel> {
		for (let i = 0; i < this.channelCount; i++) {
			yield this.getChannel(i);
		}
	}

	get name(): string {
		return this.boardInfo.name || `CIFx${this.boardIndex}`;
	}
}

export class Channel {

	private handle: CIFXHANDLE = undefined;
	private _hostReady: boolean = false;
	private _busOpen: boolean = false;

	constructor(readonly board: Board, readonly channelIndex: number, private readonly channelInfo: CHANNEL_INFORMATION) {

	}

	get opened(): boolean {
		return this.handle !== undefined;
	}

	get hostReady(): boolean {
		return this._hostReady;
	}

	get busOpen(): boolean {
		return this._busOpen;
	}

	open() {
		if (this.opened) {
			throw new CifXError("CifX channel already opened.", 0);
		}
		const handle = [[null]];
		const ret = CifX_impl.openChannel(this.board.driver.handle, this.board.name, this.channelIndex, handle);
		this.handle = handle[0];
		if (ret != CIFX_NO_ERROR) {
			this.close();
			throw new CifXError("CifX channel open failed", ret);
		}
	}

	close() {
		if (!this.opened) {
			throw new CifXError("CifX channel not opened.", 0);
		}
		const ret = CifX_impl.closeChannel(this.handle);
		if (ret != CIFX_NO_ERROR) {
			throw new CifXError("CifX channel close failed", ret);
		}
		this.handle = undefined;
	}

	ioWrite(areaNumber: number, offset: number, data: Buffer, timeout: number = CIFX_IO_WAIT_TIMEOUT) {
		if (!this.opened) {
			throw new CifXError("CifX channel not opened.", 0);
		}
		if (!this.busOpen) {
			throw new CifXError("CifX bus not open.", 0);
		}
		if (data.length === 0) {
			throw new CifXError("CifX io data cannot be empty.", 0);
		}
		const ret = CifX_impl.ioWrite(this.handle, areaNumber, offset, data.length, data, timeout);
		if (ret != CIFX_NO_ERROR) {
			throw new CifXError("CifX io write failed", ret);
		}
	}

	ioRead(areaNumber: number, offset: number, dataLength: number, timeout: number = CIFX_IO_WAIT_TIMEOUT): Buffer {
		if (!this.opened) {
			throw new CifXError("CifX channel not opened.", 0);
		}
		if (!this.busOpen) {
			throw new CifXError("CifX bus not open.", 0);
		}
		if (dataLength === 0) {
			throw new CifXError("CifX io data cannot be empty.", 0);
		}
		const data = Buffer.alloc(dataLength);
		const ret = CifX_impl.ioWrite(this.handle, areaNumber, offset, data.length, data, timeout);
		if (ret != CIFX_NO_ERROR) {
			throw new CifXError("CifX io read failed", ret);
		}
		return data;
	}
}