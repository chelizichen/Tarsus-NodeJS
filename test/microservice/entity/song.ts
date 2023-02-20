import { requiedField } from "../../../decorator/microservice/field/FieldType";


class Song{
  private fieldLength = 2

  songName: requiedField = 0;
  songTime: requiedField = 1;

  constructor(args:any[]) {
    if (args.length == this.fieldLength) {
      this.songName = args[this.songName];
      this.songTime = args[this.songTime];
    }
  }

  logDetail() {
    return `${this.songName} ${this.songTime}`
  }
}

export {
  Song
}