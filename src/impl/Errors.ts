import {CIFX_LIB} from "../loader";
import * as koffi from "koffi";

export const CIFX_NO_ERROR = 0x00000000;

/*
**********************************************************************************
* Generic Errors
**********************************************************************************
*/

/**
MessageId: CIFX_INVALID_POINTER
MessageText:
	Invalid pointer (NULL passed to driver)
 **/
export const CIFX_INVALID_POINTER = 0x800A0001

/** 
MessageId: CIFX_INVALID_BOARD
MessageText:
	No board with the given name / index available
 **/
export const CIFX_INVALID_BOARD = 0x800A0002

/** 
MessageId: CIFX_INVALID_CHANNEL
MessageText:
	No channel with the given index available
 **/
export const CIFX_INVALID_CHANNEL = 0x800A0003

/**
MessageId: CIFX_INVALID_HANDLE
MessageText:
	Invalid handle passed to driver
 **/
export const CIFX_INVALID_HANDLE = 0x800A0004

/** 
MessageId: CIFX_INVALID_PARAMETER
MessageText:
	Invalid parameter
 **/
export const CIFX_INVALID_PARAMETER = 0x800A0005

/** 
MessageId: CIFX_INVALID_COMMAND
MessageText:
	Invalid command
 **/
export const CIFX_INVALID_COMMAND = 0x800A0006

/** 
MessageId: CIFX_INVALID_BUFFERSIZE
MessageText:
	Invalid buffer size
 **/
export const CIFX_INVALID_BUFFERSIZE = 0x800A0007

/**
MessageId: CIFX_INVALID_ACCESS_SIZE
MessageText:
	Invalid access size
 **/
export const CIFX_INVALID_ACCESS_SIZE = 0x800A0008

/** 
MessageId: CIFX_FUNCTION_FAILED
MessageText:
	Function failed
 **/
export const CIFX_FUNCTION_FAILED = 0x800A0009

/** 
MessageId: CIFX_FILE_OPEN_FAILED
MessageText:
	File could not be opened
 **/
export const CIFX_FILE_OPEN_FAILED = 0x800A000A

/** 
MessageId: CIFX_FILE_SIZE_ZERO
MessageText:
	File size is zero
 **/
export const CIFX_FILE_SIZE_ZERO = 0x800A000B

/** 
MessageId: CIFX_FILE_LOAD_INSUFF_MEM
MessageText:
	Insufficient memory to load file
 **/
export const CIFX_FILE_LOAD_INSUFF_MEM = 0x800A000C

/** 
MessageId: CIFX_FILE_CHECKSUM_ERROR
MessageText:
	File checksum compare failed
 **/
export const CIFX_FILE_CHECKSUM_ERROR = 0x800A000D

/** 
MessageId: CIFX_FILE_READ_ERROR
MessageText:
	Error reading from file
 **/
export const CIFX_FILE_READ_ERROR = 0x800A000E

/** 
MessageId: CIFX_FILE_TYPE_INVALID
MessageText:
	Invalid file type
 **/
export const CIFX_FILE_TYPE_INVALID = 0x800A000F

/** 
MessageId: CIFX_FILE_NAME_INVALID
MessageText:
	Invalid file name
 **/
export const CIFX_FILE_NAME_INVALID = 0x800A0010

/** 
MessageId: CIFX_FUNCTION_NOT_AVAILABLE
MessageText:
	Driver function not available
 **/
export const CIFX_FUNCTION_NOT_AVAILABLE = 0x800A0011

/** 
MessageId: CIFX_BUFFER_TOO_SHORT
MessageText:
	Given buffer is too short
 **/
export const CIFX_BUFFER_TOO_SHORT = 0x800A0012

/** 
MessageId: CIFX_MEMORY_MAPPING_FAILED
MessageText:
	Failed to map the memory
 **/
export const CIFX_MEMORY_MAPPING_FAILED = 0x800A0013

/** 
MessageId: CIFX_NO_MORE_ENTRIES
MessageText:
	No more entries available
 **/
export const CIFX_NO_MORE_ENTRIES = 0x800A0014

/*
*******************************************************************************
* Generic Driver Errors
*******************************************************************************
*/

/** 
MessageId: CIFX_DRV_NOT_INITIALIZED
MessageText:
	Driver not initialized
 **/
export const CIFX_DRV_NOT_INITIALIZED = 0x800B0001

/** 
MessageId: CIFX_DRV_INIT_STATE_ERROR
MessageText:
	Driver init state error
 **/
export const CIFX_DRV_INIT_STATE_ERROR = 0x800B0002

/** 
MessageId: CIFX_DRV_READ_STATE_ERROR
MessageText:
	Driver read state error
 **/
export const CIFX_DRV_READ_STATE_ERROR = 0x800B0003

/** 
MessageId: CIFX_DRV_CMD_ACTIVE
MessageText:
	Command is active on device
 **/
export const CIFX_DRV_CMD_ACTIVE = 0x800B0004

/** 
MessageId: CIFX_DRV_DOWNLOAD_FAILED
MessageText:
	General error during download
 **/
export const CIFX_DRV_DOWNLOAD_FAILED = 0x800B0005


/** 
MessageId: CIFX_DRV_WRONG_DRIVER_VERSION
MessageText:
	Wrong driver version
 **/
export const CIFX_DRV_WRONG_DRIVER_VERSION = 0x800B0006

/** 
MessageId: CIFX_DRV_DRIVER_NOT_LOADED
MessageText:
	CIFx driver is not running
 **/
export const CIFX_DRV_DRIVER_NOT_LOADED = 0x800B0030

/** 
MessageId: CIFX_DRV_INIT_ERROR
MessageText:
	Failed to initialize the device
 **/
export const CIFX_DRV_INIT_ERROR = 0x800B0031

/** 
MessageId: CIFX_DRV_CHANNEL_NOT_INITIALIZED
MessageText:
	Channel not initialized (xOpenChannel not called
 **/
export const CIFX_DRV_CHANNEL_NOT_INITIALIZED = 0x800B0032

/** 
MessageId: CIFX_DRV_IO_CONTROL_FAILED
MessageText:
	IOControl call failed
 **/
export const CIFX_DRV_IO_CONTROL_FAILED = 0x800B0033

/** 
MessageId: CIFX_DRV_NOT_OPENED
MessageText:
	Driver was not opened
 **/
export const CIFX_DRV_NOT_OPENED = 0x800B0034

/*
*******************************************************************************
* Generic Device Errors
*******************************************************************************
*/

/** 
MessageId: CIFX_DEV_DPM_ACCESS_ERROR
MessageText:
	Dual port memory not accessable (board not found
 **/
export const CIFX_DEV_DPM_ACCESS_ERROR = 0x800C0010

/** 
MessageId: CIFX_DEV_NOT_READY
MessageText:
	Device not ready (ready flag failed
 **/
export const CIFX_DEV_NOT_READY = 0x800C0011

/** 
MessageId: CIFX_DEV_NOT_RUNNING
MessageText:
	Device not running (running flag failed
 **/
export const CIFX_DEV_NOT_RUNNING = 0x800C0012

/** 
MessageId: CIFX_DEV_WATCHDOG_FAILED
MessageText:
	Watchdog test failed
 **/
export const CIFX_DEV_WATCHDOG_FAILED = 0x800C0013

/** 
MessageId: CIFX_DEV_SYSERR
MessageText:
	Error in handshake flags
 **/
export const CIFX_DEV_SYSERR = 0x800C0015

/** 
MessageId: CIFX_DEV_MAILBOX_FULL
MessageText:
	Send mailbox is full
 **/
export const CIFX_DEV_MAILBOX_FULL = 0x800C0016

/** 
MessageId: CIFX_DEV_PUT_TIMEOUT
MessageText:
	Send packet timeout
 **/
export const CIFX_DEV_PUT_TIMEOUT = 0x800C0017

/** 
MessageId: CIFX_DEV_GET_TIMEOUT
MessageText:
	Receive packet timeout
 **/
export const CIFX_DEV_GET_TIMEOUT = 0x800C0018

/** 
MessageId: CIFX_DEV_GET_NO_PACKET
MessageText:
	No packet available
 **/
export const CIFX_DEV_GET_NO_PACKET = 0x800C0019

/** 
MessageId: CIFX_DEV_MAILBOX_TOO_SHORT
MessageText:
	Mailbox too short
 **/
export const CIFX_DEV_MAILBOX_TOO_SHORT = 0x800C001A

/** 
MessageId: CIFX_DEV_RESET_TIMEOUT
MessageText:
	Reset command timeout
 **/
export const CIFX_DEV_RESET_TIMEOUT = 0x800C0020

/** 
MessageId: CIFX_DEV_NO_COM_FLAG
MessageText:
	COM-flag not set
 **/
export const CIFX_DEV_NO_COM_FLAG = 0x800C0021

/** 
MessageId: CIFX_DEV_EXCHANGE_FAILED
MessageText:
	I/O data exchange failed
 **/
export const CIFX_DEV_EXCHANGE_FAILED = 0x800C0022

/** 
MessageId: CIFX_DEV_EXCHANGE_TIMEOUT
MessageText:
	I/O data exchange timeout
 **/
export const CIFX_DEV_EXCHANGE_TIMEOUT = 0x800C0023

/** 
MessageId: CIFX_DEV_COM_MODE_UNKNOWN
MessageText:
	Unknown I/O exchange mode
 **/
export const CIFX_DEV_COM_MODE_UNKNOWN = 0x800C0024

/** 
MessageId: CIFX_DEV_FUNCTION_FAILED
MessageText:
	Device function failed
 **/
export const CIFX_DEV_FUNCTION_FAILED = 0x800C0025

/** 
MessageId: CIFX_DEV_DPMSIZE_MISMATCH
MessageText:
	DPM size differs from configuration
 **/
export const CIFX_DEV_DPMSIZE_MISMATCH = 0x800C0026

/** 
MessageId: CIFX_DEV_STATE_MODE_UNKNOWN
MessageText:
	Unknown state mode
 **/
export const CIFX_DEV_STATE_MODE_UNKNOWN = 0x800C0027

/** 
MessageId: CIFX_DEV_HW_PORT_IS_USED
MessageText:
	Output port already in use
 **/
export const CIFX_DEV_HW_PORT_IS_USED = 0x800C0028

/** 
MessageId: CIFX_DEV_CONFIG_LOCK_TIMEOUT
MessageText:
	Configuration locking timeout
 **/
export const CIFX_DEV_CONFIG_LOCK_TIMEOUT = 0x800C0029

/** 
MessageId: CIFX_DEV_CONFIG_UNLOCK_TIMEOUT
MessageText:
	Configuration unlocking timeout
 **/
export const CIFX_DEV_CONFIG_UNLOCK_TIMEOUT = 0x800C002A

/** 
MessageId: CIFX_DEV_HOST_STATE_SET_TIMEOUT
MessageText:
	Set HOST state timeout
 **/
export const CIFX_DEV_HOST_STATE_SET_TIMEOUT = 0x800C002B

/** 
MessageId: CIFX_DEV_HOST_STATE_CLEAR_TIMEOUT
MessageText:
	Clear HOST state timeout
 **/
export const CIFX_DEV_HOST_STATE_CLEAR_TIMEOUT = 0x800C002C

/** 
MessageId: CIFX_DEV_INITIALIZATION_TIMEOUT
MessageText:
	Timeout during channel initialization
 **/
export const CIFX_DEV_INITIALIZATION_TIMEOUT = 0x800C002D

/** 
MessageId: CIFX_DEV_BUS_STATE_ON_TIMEOUT
MessageText:
	Set Bus ON Timeout
 **/
export const CIFX_DEV_BUS_STATE_ON_TIMEOUT = 0x800C002E

/** 
MessageId: CIFX_DEV_BUS_STATE_OFF_TIMEOUT
MessageText:
	Set Bus OFF Timeout
 **/
export const CIFX_DEV_BUS_STATE_OFF_TIMEOUT = 0x800C002F

const map = {
	[CIFX_NO_ERROR]: "CIFX_NO_ERROR",
	[CIFX_INVALID_POINTER]: "CIFX_INVALID_POINTER",
	[CIFX_INVALID_BOARD]: "CIFX_INVALID_BOARD",
	[CIFX_INVALID_CHANNEL]: "CIFX_INVALID_CHANNEL",
	[CIFX_INVALID_HANDLE]: "CIFX_INVALID_HANDLE",
	[CIFX_INVALID_PARAMETER]: "CIFX_INVALID_PARAMETER",
	[CIFX_INVALID_COMMAND]: "CIFX_INVALID_COMMAND",
	[CIFX_INVALID_BUFFERSIZE]: "CIFX_INVALID_BUFFERSIZE",
	[CIFX_INVALID_ACCESS_SIZE]: "CIFX_INVALID_ACCESS_SIZE",
	[CIFX_FUNCTION_FAILED]: "CIFX_FUNCTION_FAILED",
	[CIFX_FILE_OPEN_FAILED]: "CIFX_FILE_OPEN_FAILED",
	[CIFX_FILE_SIZE_ZERO]: "CIFX_FILE_SIZE_ZERO",
	[CIFX_FILE_LOAD_INSUFF_MEM]: "CIFX_FILE_LOAD_INSUFF_MEM",
	[CIFX_FILE_CHECKSUM_ERROR]: "CIFX_FILE_CHECKSUM_ERROR",
	[CIFX_FILE_READ_ERROR]: "CIFX_FILE_READ_ERROR",
	[CIFX_FILE_TYPE_INVALID]: "CIFX_FILE_TYPE_INVALID",
	[CIFX_FILE_NAME_INVALID]: "CIFX_FILE_NAME_INVALID",
	[CIFX_FUNCTION_NOT_AVAILABLE]: "CIFX_FUNCTION_NOT_AVAILABLE",
	[CIFX_BUFFER_TOO_SHORT]: "CIFX_BUFFER_TOO_SHORT",
	[CIFX_MEMORY_MAPPING_FAILED]: "CIFX_MEMORY_MAPPING_FAILED",
	[CIFX_NO_MORE_ENTRIES]: "CIFX_NO_MORE_ENTRIES",
	[CIFX_DRV_NOT_INITIALIZED]: "CIFX_DRV_NOT_INITIALIZED",
	[CIFX_DRV_INIT_STATE_ERROR]: "CIFX_DRV_INIT_STATE_ERROR",
	[CIFX_DRV_READ_STATE_ERROR]: "CIFX_DRV_READ_STATE_ERROR",
	[CIFX_DRV_CMD_ACTIVE]: "CIFX_DRV_CMD_ACTIVE",
	[CIFX_DRV_DOWNLOAD_FAILED]: "CIFX_DRV_DOWNLOAD_FAILED",
	[CIFX_DRV_WRONG_DRIVER_VERSION]: "CIFX_DRV_WRONG_DRIVER_VERSION",
	[CIFX_DRV_DRIVER_NOT_LOADED]: "CIFX_DRV_DRIVER_NOT_LOADED",
	[CIFX_DRV_INIT_ERROR]: "CIFX_DRV_INIT_ERROR",
	[CIFX_DRV_CHANNEL_NOT_INITIALIZED]: "CIFX_DRV_CHANNEL_NOT_INITIALIZED",
	[CIFX_DRV_IO_CONTROL_FAILED]: "CIFX_DRV_IO_CONTROL_FAILED",
	[CIFX_DRV_NOT_OPENED]: "CIFX_DRV_NOT_OPENED",
	[CIFX_DEV_DPM_ACCESS_ERROR]: "CIFX_DEV_DPM_ACCESS_ERROR",
	[CIFX_DEV_NOT_READY]: "CIFX_DEV_NOT_READY",
	[CIFX_DEV_NOT_RUNNING]: "CIFX_DEV_NOT_RUNNING",
	[CIFX_DEV_WATCHDOG_FAILED]: "CIFX_DEV_WATCHDOG_FAILED",
	[CIFX_DEV_SYSERR]: "CIFX_DEV_SYSERR",
	[CIFX_DEV_MAILBOX_FULL]: "CIFX_DEV_MAILBOX_FULL",
	[CIFX_DEV_PUT_TIMEOUT]: "CIFX_DEV_PUT_TIMEOUT",
	[CIFX_DEV_GET_TIMEOUT]: "CIFX_DEV_GET_TIMEOUT",
	[CIFX_DEV_GET_NO_PACKET]: "CIFX_DEV_GET_NO_PACKET",
	[CIFX_DEV_MAILBOX_TOO_SHORT]: "CIFX_DEV_MAILBOX_TOO_SHORT",
	[CIFX_DEV_RESET_TIMEOUT]: "CIFX_DEV_RESET_TIMEOUT",
	[CIFX_DEV_NO_COM_FLAG]: "CIFX_DEV_NO_COM_FLAG",
	[CIFX_DEV_EXCHANGE_FAILED]: "CIFX_DEV_EXCHANGE_FAILED",
	[CIFX_DEV_EXCHANGE_TIMEOUT]: "CIFX_DEV_EXCHANGE_TIMEOUT",
	[CIFX_DEV_COM_MODE_UNKNOWN]: "CIFX_DEV_COM_MODE_UNKNOWN",
	[CIFX_DEV_FUNCTION_FAILED]: "CIFX_DEV_FUNCTION_FAILED",
	[CIFX_DEV_DPMSIZE_MISMATCH]: "CIFX_DEV_DPMSIZE_MISMATCH",
	[CIFX_DEV_STATE_MODE_UNKNOWN]: "CIFX_DEV_STATE_MODE_UNKNOWN",
	[CIFX_DEV_HW_PORT_IS_USED]: "CIFX_DEV_HW_PORT_IS_USED",
	[CIFX_DEV_CONFIG_LOCK_TIMEOUT]: "CIFX_DEV_CONFIG_LOCK_TIMEOUT",
	[CIFX_DEV_CONFIG_UNLOCK_TIMEOUT]: "CIFX_DEV_CONFIG_UNLOCK_TIMEOUT",
	[CIFX_DEV_HOST_STATE_SET_TIMEOUT]: "CIFX_DEV_HOST_STATE_SET_TIMEOUT",
	[CIFX_DEV_HOST_STATE_CLEAR_TIMEOUT]: "CIFX_DEV_HOST_STATE_CLEAR_TIMEOUT",
	[CIFX_DEV_INITIALIZATION_TIMEOUT]: "CIFX_DEV_INITIALIZATION_TIMEOUT",
	[CIFX_DEV_BUS_STATE_ON_TIMEOUT]: "CIFX_DEV_BUS_STATE_ON_TIMEOUT",
	[CIFX_DEV_BUS_STATE_OFF_TIMEOUT]: "CIFX_DEV_BUS_STATE_OFF_TIMEOUT"
}

const getErrorDescription = CIFX_LIB.func("xDriverGetErrorDescription", "int", ["int", koffi.out("char*"), "int"]);

export class CifXError extends Error {

	public errorName: string;
	public description: string;

	constructor(message: string, public code: number) {
		super(message);
		this.errorName = map[code >>> 0] || "UnknownError";
		this.description = this.getErrorDescription();
	}

	getErrorDescription(): string {
		if (this.code === CIFX_NO_ERROR) {
			return "No error";
		}
		let description = Buffer.alloc(1024);
		getErrorDescription(this.code, description, description.length);
		return String(description).replace(/\0/g, "");
	}
}