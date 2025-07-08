# 🚀 jscifx

A TypeScript/JavaScript API for controlling Hilscher CIFX cards.

[![npm version](https://img.shields.io/npm/v/jscifx.svg?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/jscifx)
[![NPM Downloads](https://img.shields.io/npm/dw/jscifx?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/jscifx)
[![GitHub issues](https://img.shields.io/github/issues/PooruTorie/jscifx.svg?style=for-the-badge&logo=github)](https://github.com/PooruTorie/jscifx/issues)
[![GitHub stars](https://img.shields.io/github/stars/PooruTorie/jscifx.svg?style=for-the-badge&logo=github)](https://github.com/PooruTorie/jscifx/stargazers)
[![GitHub contributors](https://img.shields.io/github/contributors/PooruTorie/jscifx.svg?style=for-the-badge&logo=github)](https://github.com/PooruTorie/jscifx/contributors)

## 📝 Overview

This package provides a simple interface for communicating with Hilscher CIFX cards in Node.js. It enables sending and receiving process data as well as
managing the cards via a modern API.

## ✨ Features

- ⚡ Easy initialization and management of CIFX cards
- 🔄 Send and receive IO data
- 🧩 Support for multiple cards and channels
- 🛡️ Includes TypeScript type definitions

## 📦 Installation

> **Note:** This package requires cifx drivers to be installed.  
> More information can be found in the [Hilscher documentation](https://hilscher.atlassian.net/wiki/spaces/CIFXDRV/overview).

```bash
npm install jscifx
```

## 📚 Documentation

### `CifX`

Static class for initializing, deinitializing, and managing the CifX driver. Ensures the driver is set up before use and provides access to the `Driver` class.

**Main Methods:**

- `CifX.init()`: Initializes the driver. Throws if already initialized.
- `CifX.deinit()`: Deinitializes the driver. Throws if not initialized.
- `CifX.openDriver()`: Opens the driver and returns a `Driver` instance.
- `CifX.initialized`: Returns `true` if the driver is initialized.

**Example:**

```typescript
import {CifX} from "jscifx";

CifX.init();
const driver = CifX.openDriver();
// ... use driver
driver.close();
CifX.deinit();
```

---

### `Driver`

Represents an open handle to the CifX driver. Allows querying driver information and enumerating connected boards.

**Main Methods & Properties:**

- `driver.version`: Returns the driver version string.
- `driver.boardCount`: Number of available boards.
- `driver.getBoard(index)`: Returns a `Board` instance for the given index.
- `driver.enumerateBoards()`: Generator to iterate over all boards.
- `driver.close()`: Closes the driver handle.

**Example:**

```typescript
for (const board of driver.enumerateBoards()) {
	console.log(board.name);
}
```

---

### `Board`

Represents a hardware board managed by the driver. Provides access to board information and its communication channels.

**Main Methods & Properties:**

- `board.name`: Name of the board.
- `board.channelCount`: Number of channels on the board.
- `board.getChannel(index)`: Returns a `Channel` instance.
- `board.enumerateChannels()`: Generator to iterate over all channels.

**Example:**

```typescript
const board = driver.getBoard(0);
for (const channel of board.enumerateChannels()) {
	console.log(channel.firmware);
}
```

---

### `Channel`

Represents a communication channel on a board. Supports opening/closing, managing bus/host state, and I/O operations.

**Main Methods & Properties:**

- `channel.open() / channel.close()`: Open/close the channel.
- `channel.openBus() / channel.closeBus()`: Open/close the bus for communication.
- `channel.startHost() / channel.stopHost()`: Set host state.
- `channel.ioWrite(area, offset, data, timeout?)`: Write data to I/O area.
- `channel.ioRead(area, offset, length, timeout?)`: Read data from I/O area.
- `channel.firmware`: Firmware name of the channel.

**Example:**

```typescript
const channel = board.getChannel(0);
channel.open();
channel.startHost();
channel.openBus();
channel.ioWrite(0, 0, Buffer.from([1, 2, 3]));
const data = channel.ioRead(0, 0, 3);
channel.closeBus();
channel.stopHost();
channel.close();
```

---

**General Notes:**

- Always call `CifX.init()` before using any driver functionality and `CifX.deinit()` when done.
- Use try/catch to handle `CifXError` exceptions.
- The API is synchronous and throws on errors.
- All resources (driver, channels) should be closed after use to avoid leaks.

## 🛠️ Support

If you have questions or issues, please open an [issue](https://github.com/PooruTorie/jscifx/issues).

## 📄 License

[MIT](LICENSE)