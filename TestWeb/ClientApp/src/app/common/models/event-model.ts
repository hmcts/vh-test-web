import { getuid } from "process";
import { EventType, RoomType } from "src/app/services/clients/api-client";

export class AllocateUsersModel {
  constructor() {
      this.event_id = getuid.toString();
      this.time_stamp_utc = new Date();
      this.transfer_from = RoomType.WaitingRoom;
      this.transfer_to = RoomType.WaitingRoom;
  }

  "event_id": string |  undefined;
  "event_type": EventType |  undefined;
  "time_stamp_utc": Date | undefined;
  "conference_id": string |  undefined;
  "participant_id": string |  undefined;
  "transfer_from": RoomType |  undefined;
  "transfer_to": RoomType |  undefined;
  "reason": string |  undefined;
  "phone": string |  undefined;
}
