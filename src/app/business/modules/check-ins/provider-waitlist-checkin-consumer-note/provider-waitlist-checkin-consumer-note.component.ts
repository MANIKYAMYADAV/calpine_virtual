import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
import { Messages } from '../../../../shared/constants/project-messages';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { DateTimeProcessor } from '../../../../shared/services/datetime-processor.service';

@Component({
  selector: 'app-provider-waitlist-checkin-consumer-note',
  templateUrl: './provider-waitlist-checkin-consumer-note.component.html',
  styleUrls: ['./provider-waitlist-checkin-consumer-note.component.css']
})

export class ProviderWaitlistCheckInConsumerNoteComponent implements OnInit {

  note_cap = Messages.CONS_NOTE_NOTE_CAP;
  cancel_btn_cap = Messages.CANCEL_BTN;
  checkin;
  consumer_label = '';
  type;
  noteTitle;
  constructor(
    public dialogRef: MatDialogRef<ProviderWaitlistCheckInConsumerNoteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public sharedfunctionObj: SharedFunctions,
    private wordProcessor: WordProcessor,
    private dateTimeProcessor: DateTimeProcessor

  ) {
    console.log(data);
    this.checkin = data.checkin;
    this.type = data.type;
    if (this.checkin.service && this.checkin.service.consumerNoteTitle) {
      this.noteTitle = this.checkin.service.consumerNoteTitle;
    } else {
      if (this.type === 'order-details') {
        this.noteTitle = 'Item Notes';
      } else {
        this.noteTitle = 'Notes';
      }
    }
    this.consumer_label = this.wordProcessor.getTerminologyTerm('customer');
  }

  ngOnInit() {
  }
  getSingleTime(slot) {
    const slots = slot.split('-');
    return this.dateTimeProcessor.convert24HourtoAmPm(slots[0]);
  }
}
