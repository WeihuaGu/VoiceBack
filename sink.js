import { Writable, Readable } from 'stream'
import sqlite3 from'sqlite3';

sqlite3.verbose();


// 自定义可写流类，用于接收音频数据并播放
class AudioSink extends Writable {
    constructor(rec_options) {
        super();
	this.chunkCount = 0;
        this.maxChunkCount = options.maxChunkCount || 10; // 达到10个数据块后写入
        this.dataBuffer = [];
        this.db = new sqlite3.Database('audio.db');
        this.initDatabase();
    }
  
    initDatabase() {
        const createTableSql = `
            CREATE TABLE IF NOT EXISTS audio_data (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                audio_chunk BLOB,
                write_time DATETIME
            )
        `;
        this.db.run(createTableSql, (err) => {
            if (err) {
                console.error('Error creating database table:', err);
            }
        });
    }

     writeToDatabase() {
        const now = new Date().toISOString();
        const insertSql = 'INSERT INTO audio_data (audio_chunk, write_time) VALUES (?,?)';
        const stmt = this.db.prepare(insertSql);
        this.dataBuffer.forEach((chunk) => {
            stmt.run(chunk, now, (err) => {
                if (err) {
                    console.error('Error inserting audio chunk into database:', err);
                }
            });
        });
        stmt.finalize();
    }
	
    _write(chunk, encoding, callback) {
        // 将接收到的音频数据块写入到扬声器进行播放
	this.dataBuffer.push(chunk);
        this.chunkCount++;
        if (this.chunkCount >= this.maxChunkCount) {
            this.writeToDatabase();
            this.chunkCount = 0;
            this.dataBuffer = [];
        }
        callback();
    }

     _final(callback) {
        if (this.dataBuffer.length > 0) {
            this.writeToDatabase();
        }
        this.db.close();
        callback();
    }

    getNextAudioReadStream() {
        let currentId = 1;
        return new Readable({
            objectMode: false,
            read() {
                this._read(currentId);
                currentId++;
            },
            _read: function (id) {
                const query = 'SELECT audio_chunk FROM audio_data WHERE id =?';
                this.db.get(query, id, (err, row) => {
                    if (err) {
                        this.emit('error', err);
                        return;
                    }
                    if (row) {
                        this.push(row.audio_chunk);
                    } else {
                        this.push(null);
                    }
                });
            },
            db: this.db
        });
    }
}

export { AudioSink }
