import { psn } from './types'

// const startTime = Date.now()

const theSystem: psn.System = {
	name: 'node test',
	version: '2.02',
}

const zeroVector = {
	x: 0,
	y: 0,
	z: 0,
}

const theTrackedThing: psn.Tracker = {
	id: 1,
	name: 'Test Tracked Thing',
	orientation: zeroVector,
	position: zeroVector,
	speed: zeroVector,
	acceleration: zeroVector,
	target: zeroVector,
	status: true,

}

const encodeInfoPacket = (
	timestamp: number,
	frame: number,
	system: psn.System,
	trackerList: psn.Tracker[],
) => {
	const trackerName = wrapChunk(
		[Buffer.from(trackerList[0].name)],
		0,
		false,
	)
	const tracker = wrapChunk(
		[trackerName],
		trackerList[0].id,
		true,
	)
	const trackerListChunk = wrapChunk(
		[tracker],
		0x0002,
		true,
	)

	const systemNameChunk = wrapChunk(
		[Buffer.from(system.name)],
		0x0001,
		false,
	)

	const infoHeaderBuffer = Buffer.alloc(12)
	infoHeaderBuffer.writeUInt32LE(0, 0)
	infoHeaderBuffer.writeUInt32LE(timestamp, 4)
	infoHeaderBuffer.writeUInt8(2, 8)
	infoHeaderBuffer.writeUInt8(2, 9)
	infoHeaderBuffer.writeUInt8(frame, 10)
	infoHeaderBuffer.writeUInt8(1, 11)

	const infoPacketHeaderChunk = wrapChunk(
		[infoHeaderBuffer],
		0x0000,
		false,
	)

	return wrapChunk(
		[infoPacketHeaderChunk, systemNameChunk, trackerListChunk],
		psn.INFO_PACKET.HEADER,
		true,
	)

}

const wrapChunk = (childChunks: Buffer[], chunkId, hasSubchunks: boolean): Buffer => {
	const size = 4
	const children = Buffer.concat(childChunks)
	const chunkHeader = Buffer.alloc(size)
	chunkHeader.writeUInt16BE(chunkId, 0)
	chunkHeader.writeUInt16BE((children.length << 1) + (hasSubchunks ? 1 : 0), 2)
	// chunkHeader.writeUIntLE(, 31, 1)
	// (chunkId << 16) + ((children.length) << 1) + (childChunks.length > 0 ? 1 : 0),
	// 0)
	return Buffer.concat([chunkHeader, children])
}

const packet = encodeInfoPacket(0, 1, theSystem, [theTrackedThing])
console.log(packet)
console.log(packet.length)
// console.log(encodeInfoPacket(0, 1, theSystem, [theTrackedThing]).toString())
