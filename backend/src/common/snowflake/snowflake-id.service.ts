import { Injectable } from '@nestjs/common';

export interface SnowflakeConfig {
  datacenterId: number;
  workerId: number;
  epoch?: number;
}

export interface ParsedSnowflakeId {
  timestamp: number;
  datacenterId: number;
  workerId: number;
  sequence: number;
}

@Injectable()
export class SnowflakeIdService {
  // Twitter's epoch (2010-11-04T01:42:54.657Z)
  private readonly defaultEpoch = 1288834974657n;
  private readonly epoch: bigint;
  
  // Bit lengths
  private readonly timestampBits = 41n;
  private readonly datacenterIdBits = 5n;
  private readonly workerIdBits = 5n;
  private readonly sequenceBits = 12n;
  
  // Max values
  private readonly maxDatacenterId = (1n << this.datacenterIdBits) - 1n; // 31
  private readonly maxWorkerId = (1n << this.workerIdBits) - 1n; // 31
  private readonly sequenceMask = (1n << this.sequenceBits) - 1n; // 4095
  
  // Bit shifts
  private readonly workerIdShift = this.sequenceBits;
  private readonly datacenterIdShift = this.sequenceBits + this.workerIdBits;
  private readonly timestampShift = this.sequenceBits + this.workerIdBits + this.datacenterIdBits;
  
  private sequence = 0n;
  private lastTimestamp = -1n;
  
  private readonly datacenterId: bigint;
  private readonly workerId: bigint;
  
  constructor(config: SnowflakeConfig) {
    if (config.datacenterId < 0 || config.datacenterId > Number(this.maxDatacenterId)) {
      throw new Error(`Datacenter ID must be between 0 and ${this.maxDatacenterId}`);
    }
    
    if (config.workerId < 0 || config.workerId > Number(this.maxWorkerId)) {
      throw new Error(`Worker ID must be between 0 and ${this.maxWorkerId}`);
    }
    
    this.datacenterId = BigInt(config.datacenterId);
    this.workerId = BigInt(config.workerId);
    this.epoch = config.epoch ? BigInt(config.epoch) : this.defaultEpoch;
  }
  
  generateId(): string {
    let timestamp = this.currentTime();
    
    if (timestamp < this.lastTimestamp) {
      // Clock moved backwards, wait until it catches up
      timestamp = this.waitForNextMillis(this.lastTimestamp);
    }
    
    if (timestamp === this.lastTimestamp) {
      // Same millisecond, increment sequence
      this.sequence = (this.sequence + 1n) & this.sequenceMask;
      
      if (this.sequence === 0n) {
        // Sequence overflow, wait for next millisecond
        timestamp = this.waitForNextMillis(timestamp);
      }
    } else {
      // New millisecond, reset sequence
      this.sequence = 0n;
    }
    
    this.lastTimestamp = timestamp;
    
    const id = ((timestamp - this.epoch) << this.timestampShift) |
               (this.datacenterId << this.datacenterIdShift) |
               (this.workerId << this.workerIdShift) |
               this.sequence;
    
    return id.toString();
  }
  
  parse(id: string): ParsedSnowflakeId {
    const snowflakeId = BigInt(id);
    
    const sequence = Number(snowflakeId & this.sequenceMask);
    const workerId = Number((snowflakeId >> this.workerIdShift) & this.maxWorkerId);
    const datacenterId = Number((snowflakeId >> this.datacenterIdShift) & this.maxDatacenterId);
    const timestamp = Number((snowflakeId >> this.timestampShift) + this.epoch);
    
    return {
      timestamp: timestamp - Number(this.epoch),
      datacenterId,
      workerId,
      sequence,
    };
  }
  
  reconstruct(timestamp: number, datacenterId: number, workerId: number, sequence: number): string {
    const id = (BigInt(timestamp) << this.timestampShift) |
               (BigInt(datacenterId) << this.datacenterIdShift) |
               (BigInt(workerId) << this.workerIdShift) |
               BigInt(sequence);
    
    return id.toString();
  }
  
  private currentTime(): bigint {
    return BigInt(Date.now());
  }
  
  private waitForNextMillis(lastTimestamp: bigint): bigint {
    let timestamp = this.currentTime();
    while (timestamp <= lastTimestamp) {
      timestamp = this.currentTime();
    }
    return timestamp;
  }
}