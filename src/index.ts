import CifX_impl, {BOARD_INFORMATION, CHANNEL_INFORMATION, CIFXHANDLE, DRIVER_INFORMATION} from "./impl/CifX";
import {CIFX_NO_ERROR, CifXError} from "./impl/Errors";
import * as koffi from "koffi";
import {CIFX_BUS_STATE, CIFX_CONFIGURATION, CIFX_HOST_STATE, CIFX_IO_WAIT_TIMEOUT, CIFX_RESET, CIFX_UPDATE_STATE_WAIT_TIMEOUT} from "./impl/Consts";

/**
 * The `CifX` class provides static methods to initialize, deinitialize, and interact with the CifX driver.
 * It ensures proper initialization and cleanup of the driver and provides access to the `Driver` class.
 */
export class CifX {
	private static _initialized = false;

	/**
	 * Initializes the CifX driver. Throws an error if already initialized or if initialization fails.
	 * @throws {CifXError} If the driver is already initialized or initialization fails.
	 */
	static init() {
		if (this._initialized) {
			throw new CifXError("CifX is already initialized.", 0);
		}
		if (CifX_impl.init) {
			const ret = CifX_impl.init();
			if (ret != CIFX_NO_ERROR) {
				throw new CifXError("CifX initialization failed", ret);
			}
		}
		this._initialized = true;
	}

	/**
	 * Deinitializes the CifX driver. Throws an error if not initialized or if deinitialization fails.
	 * @throws {CifXError} If the driver is not initialized or deinitialization fails.
	 */
	static deinit() {
		if (!this._initialized) {
			throw new CifXError("CifX not initialized.", 0);
		}
		if (CifX_impl.deinit) {
			const ret = CifX_impl.deinit();
			if (ret != CIFX_NO_ERROR) {
				throw new CifXError("CifX deinitialization failed", ret);
			}
		}
		this._initialized = false;
	}

	/**
	 * Checks if the CifX driver is initialized.
	 * @returns {boolean} `true` if initialized, otherwise `false`.
	 */
	static get initialized(): boolean {
		return this._initialized;
	}

	/**
	 * Opens the CifX driver and returns a `Driver` instance.
	 * @returns {Driver} A new `Driver` instance.
	 * @throws {CifXError} If the driver is not initialized or if opening the driver fails.
	 */
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

/**
 * The `Driver` class represents a handle to the CifX driver and provides methods to interact with it.
 */
export class Driver {
	private info_cache: DRIVER_INFORMATION | null = null;

	/**
	 * Creates a new `Driver` instance.
	 * @param {CIFXHANDLE} handle The handle to the CifX driver.
	 */
	constructor(readonly handle: CIFXHANDLE) {
	}

	/**
	 * Closes the driver handle.
	 * @throws {CifXError} If closing the driver fails.
	 */
	close() {
		const ret = CifX_impl.closeDriver(this.handle);
		if (ret != CIFX_NO_ERROR) {
			throw new CifXError("CifX driver close failed", ret);
		}
	}

	/**
	 * Retrieves driver information, caching the result for subsequent calls.
	 * @returns {DRIVER_INFORMATION} The driver information.
	 * @throws {CifXError} If retrieving the driver information fails.
	 */
	protected get info(): DRIVER_INFORMATION {
		let info = {};
		if (this.info_cache) {
			info = this.info_cache;
		} else {
			const ret = CifX_impl.getInfo(this.handle, koffi.sizeof(DRIVER_INFORMATION), info);
			if (ret != CIFX_NO_ERROR) {
				throw new CifXError("CifX get version failed", ret);
			}
			this.info_cache = info as DRIVER_INFORMATION;
		}
		return info as DRIVER_INFORMATION;
	}

	/**
	 * Retrieves the driver version.
	 * @returns {string} The driver version.
	 * @throws {CifXError} If retrieving the version fails.
	 */
	get version(): string {
		if (CifX_impl.getVersion) {
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

	/**
	 * Retrieves the number of boards available.
	 * @returns {number} The number of boards.
	 */
	get boardCount(): number {
		const info: DRIVER_INFORMATION = this.info;
		return info.boardCount;
	}

	/**
	 * Retrieves a `Board` instance for the specified index.
	 * @param {number} index The index of the board.
	 * @returns {Board} The `Board` instance.
	 * @throws {CifXError} If the index is invalid or retrieving the board fails.
	 */
	getBoard(index: number): Board {
		if (index < 0 || index >= this.boardCount) {
			throw new CifXError(`Invalid board index: ${index}`, 0);
		}
		let info = {};
		const ret = CifX_impl.getBoard(this.handle, index, koffi.sizeof(BOARD_INFORMATION), info);
		if (ret != CIFX_NO_ERROR) {
			throw new CifXError("CifX get board failed", ret);
		}
		return new Board(this, index, info as BOARD_INFORMATION);
	}

	/**
	 * Enumerates all boards available.
	 * @yields {Board} Each `Board` instance.
	 */
	* enumerateBoards(): Generator<Board> {
		for (let i = 0; i < this.boardCount; i++) {
			yield this.getBoard(i);
		}
	}

	/**
	 * Prints system information, including board and channel details.
	 */
	printSystemInfo() {
		for (const board of this.enumerateBoards()) {
			for (const channel of board.enumerateChannels()) {
				console.log(`Board ${board.boardIndex} (${board.name}), Channel ${channel.channelIndex}:`);
				console.log(`  Firmware: ${channel.firmware}`);
			}
		}
	}
}

/**
 * The `Board` class represents a hardware board managed by the CifX driver.
 * It provides access to board information and its channels.
 */
export class Board {
	/**
	 * Creates a new `Board` instance.
	 * @param {Driver} driver The parent driver instance.
	 * @param {number} boardIndex The index of the board.
	 * @param {BOARD_INFORMATION} boardInfo The board information structure.
	 */
	constructor(readonly driver: Driver, readonly boardIndex: number, private readonly boardInfo: BOARD_INFORMATION) {
	}

	/**
	 * Gets the number of channels available on this board.
	 * @returns {number} The channel count.
	 */
	get channelCount(): number {
		return this.boardInfo.channelCount;
	}

	/**
	 * Retrieves a `Channel` instance for the specified channel index.
	 * @param {number} index The channel index.
	 * @returns {Channel} The channel instance.
	 * @throws {CifXError} If the channel index is invalid or retrieval fails.
	 */
	getChannel(index: number): Channel {
		if (index < 0 || index >= this.channelCount) {
			throw new CifXError(`Invalid channel index: ${index}`, 0);
		}
		let info = {};
		const ret = CifX_impl.getChannel(this.driver.handle, this.boardIndex, index, koffi.sizeof(CHANNEL_INFORMATION), info);
		if (ret != CIFX_NO_ERROR) {
			throw new CifXError("CifX get channel failed", ret);
		}
		return new Channel(this, index, info as CHANNEL_INFORMATION);
	}

	/**
	 * Enumerates all channels on this board.
	 * @yields {Channel} Each channel instance.
	 */
	* enumerateChannels(): Generator<Channel> {
		for (let i = 0; i < this.channelCount; i++) {
			yield this.getChannel(i);
		}
	}

	/**
	 * Gets the name of the board.
	 * @returns {string} The board name.
	 */
	get name(): string {
		return this.boardInfo.name || `CIFx${this.boardIndex}`;
	}
}

/**
 * The `Channel` class represents a communication channel on a board.
 * It provides methods to open/close the channel, manage bus/host state, and perform I/O operations.
 */
export class Channel {
	private handle: CIFXHANDLE | null = null;

	/**
	 * Creates a new `Channel` instance.
	 * @param {Board} board The parent board.
	 * @param {number} channelIndex The channel index.
	 * @param {CHANNEL_INFORMATION} channelInfo The channel information structure.
	 */
	constructor(readonly board: Board, readonly channelIndex: number, private readonly channelInfo: CHANNEL_INFORMATION) {
	}

	/**
	 * Indicates if the channel is currently opened.
	 * @returns {boolean} True if opened, false otherwise.
	 */
	get opened(): boolean {
		return this.handle !== null;
	}

	/**
	 * Opens the channel for communication.
	 * @throws {CifXError} If the channel is already opened or opening fails.
	 */
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

	/**
	 * Closes the channel.
	 * @throws {CifXError} If the channel is not opened or closing fails.
	 */
	close() {
		if (!this.opened) {
			throw new CifXError("CifX channel not opened.", 0);
		}
		const ret = CifX_impl.closeChannel(this.handle);
		if (ret != CIFX_NO_ERROR) {
			throw new CifXError("CifX channel close failed", ret);
		}
		this.handle = null;
	}

	/**
	 * Writes data to the channel's I/O area.
	 * @param {number} areaNumber The I/O area number.
	 * @param {number} offset The offset in the area.
	 * @param {Buffer} data The data to write.
	 * @param {number} [timeout=CIFX_IO_WAIT_TIMEOUT] Timeout in milliseconds.
	 * @throws {CifXError} If the channel or bus is not open, or writing fails.
	 */
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

	/**
	 * Reads data from the channel's I/O area.
	 * @param {number} areaNumber The I/O area number.
	 * @param {number} offset The offset in the area.
	 * @param {number} dataLength The number of bytes to read.
	 * @param {number} [timeout=CIFX_IO_WAIT_TIMEOUT] Timeout in milliseconds.
	 * @returns {Buffer} The data read.
	 * @throws {CifXError} If the channel or bus is not open, or reading fails.
	 */
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
		const ret = CifX_impl.ioRead(this.handle, areaNumber, offset, data.length, data, timeout);
		if (ret != CIFX_NO_ERROR) {
			throw new CifXError("CifX io read failed", ret);
		}
		return data;
	}

	/**
	 * Opens the bus for communication.
	 * @throws {CifXError} If the channel is not opened, bus is already open, or host is not ready.
	 */
	openBus() {
		if (!this.opened) {
			throw new CifXError("CifX channel not opened.", 0);
		}
		if (this.busOpen) {
			throw new CifXError("CifX bus already open.", 0);
		}
		if (!this.hostReady) {
			throw new CifXError("CifX host not ready.", 0);
		}
		const ret = CifX_impl.updateBusState(this.handle, CIFX_BUS_STATE.CIFX_BUS_STATE_ON, [null], CIFX_UPDATE_STATE_WAIT_TIMEOUT);
		if (ret != CIFX_NO_ERROR) {
			throw new CifXError("CifX bus open failed", ret);
		}
	}

	/**
	 * Closes the bus.
	 * @throws {CifXError} If the channel is not opened, bus is not open, or host is not ready.
	 */
	closeBus() {
		if (!this.opened) {
			throw new CifXError("CifX channel not opened.", 0);
		}
		if (!this.busOpen) {
			throw new CifXError("CifX bus not open.", 0);
		}
		if (!this.hostReady) {
			throw new CifXError("CifX host not ready.", 0);
		}
		const ret = CifX_impl.updateBusState(this.handle, CIFX_BUS_STATE.CIFX_BUS_STATE_OFF, [null], CIFX_UPDATE_STATE_WAIT_TIMEOUT);
		if (ret != CIFX_NO_ERROR) {
			throw new CifXError("CifX bus close failed", ret);
		}
	}

	/**
	 * Sets the host to ready state.
	 * @throws {CifXError} If the channel is not opened or host is already ready.
	 */
	startHost() {
		if (!this.opened) {
			throw new CifXError("CifX channel not opened.", 0);
		}
		if (this.hostReady) {
			throw new CifXError("CifX host already ready.", 0);
		}
		const ret = CifX_impl.updateHostState(this.handle, CIFX_HOST_STATE.CIFX_HOST_STATE_READY, [null], CIFX_UPDATE_STATE_WAIT_TIMEOUT);
		if (ret != CIFX_NO_ERROR) {
			throw new CifXError("CifX start host failed", ret);
		}
	}

	/**
	 * Sets the host to not ready state.
	 * @throws {CifXError} If the channel is not opened or host is not ready.
	 */
	stopHost() {
		if (!this.opened) {
			throw new CifXError("CifX channel not opened.", 0);
		}
		if (!this.hostReady) {
			throw new CifXError("CifX host not ready.", 0);
		}
		const ret = CifX_impl.updateBusState(this.handle, CIFX_HOST_STATE.CIFX_HOST_STATE_NOT_READY, [null], CIFX_UPDATE_STATE_WAIT_TIMEOUT);
		if (ret != CIFX_NO_ERROR) {
			throw new CifXError("CifX stop host failed", ret);
		}
	}

	reset(mode: CIFX_RESET) {
		if (!this.opened) {
			throw new CifXError("CifX channel not opened.", 0);
		}
		const ret = CifX_impl.resetChannel(this.handle, mode, 0);
		if (ret != CIFX_NO_ERROR) {
			throw new CifXError("CifX reset failed", ret);
		}
	}

	lockConfig() {
		if (!this.opened) {
			throw new CifXError("CifX channel not opened.", 0);
		}
		if (this.configLocked) {
			throw new CifXError("CifX config is locked.", 0);
		}
		const ret = CifX_impl.lockConfig(this.handle, CIFX_CONFIGURATION.CIFX_CONFIGURATION_LOCK, [null], CIFX_UPDATE_STATE_WAIT_TIMEOUT);
		if (ret != CIFX_NO_ERROR) {
			throw new CifXError("CifX lock config failed", ret);
		}
	}

	unlockConfig() {
		if (!this.opened) {
			throw new CifXError("CifX channel not opened.", 0);
		}
		if (!this.configLocked) {
			throw new CifXError("CifX config is not locked.", 0);
		}
		const ret = CifX_impl.lockConfig(this.handle, CIFX_CONFIGURATION.CIFX_CONFIGURATION_UNLOCK, [null], CIFX_UPDATE_STATE_WAIT_TIMEOUT);
		if (ret != CIFX_NO_ERROR) {
			throw new CifXError("CifX unlock config failed", ret);
		}
	}

	get configLocked(): boolean {
		if (!this.opened) {
			throw new CifXError("CifX channel not opened.", 0);
		}
		let state = [null]
		const ret = CifX_impl.lockConfig(this.handle, CIFX_CONFIGURATION.CIFX_CONFIGURATION_GETLOCKSTATE, state, 0);
		if (ret != CIFX_NO_ERROR) {
			throw new CifXError("CifX get config lock state failed", ret);
		}
		return state[0] == CIFX_CONFIGURATION.CIFX_CONFIGURATION_LOCK;
	}

	get hostReady(): boolean {
		if (!this.opened) {
			throw new CifXError("CifX channel not opened.", 0);
		}
		let state = [null]
		const ret = CifX_impl.updateHostState(this.handle, CIFX_HOST_STATE.CIFX_HOST_STATE_READ, state, 0);
		if (ret != CIFX_NO_ERROR) {
			throw new CifXError("CifX get host state failed", ret);
		}
		return state[0] == CIFX_HOST_STATE.CIFX_HOST_STATE_READY;
	}

	get busOpen(): boolean {
		if (!this.opened) {
			throw new CifXError("CifX channel not opened.", 0);
		}
		let state = [null]
		const ret = CifX_impl.updateBusState(this.handle, CIFX_BUS_STATE.CIFX_BUS_STATE_GETSTATE, state, 0);
		if (ret != CIFX_NO_ERROR) {
			throw new CifXError("CifX get bus state failed", ret);
		}
		return state[0] == CIFX_BUS_STATE.CIFX_BUS_STATE_ON;
	}

	/**
	 * Gets the firmware name of the channel.
	 * @returns {string} The firmware name.
	 */
	get firmware(): string {
		return this.channelInfo.abFWName.substring(0, this.channelInfo.bFWNameLength).replace(/\0/g, "") || "Unknown";
	}
}