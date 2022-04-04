import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/core/utils/snackbar/snackbar.service';
import { HistoryTimelineComponent } from '../history-timeline/history-timeline.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  displayedColumns: string[] = [
    "sno",
    "route",
    "cab",
    "name",
    "time",
    "path"
    
  ];
  @Input() trips;
  @Input() tripType;
  tripFor: any;

  @Input() set forTrip(value: any) {
    if (value) {
      this.tripFor = value;
      if (this.tripFor == 'history') {
        this.displayedColumns = [
          "tno",
          "route",
          "type",
          "cab",
          "name",
          "startTime",
          "endTime",
          "path"
        ];
      }
    }
  }

  get forTrip(): any {
    return this.tripFor;
  }

  @Output() assignCab = new EventEmitter();
  constructor(
    private router: Router,
    private msg: SnackbarService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  tripPath(trip) {
    if (trip.cab) {
      this.router.navigate([`/trips/cab/${trip.cab._id}/path`, trip._id])
    }
    else {
      this.msg.openSnackBar('There is no assigned cab in this Trip');
    }
  }

  addCab(data) {
    this.assignCab.emit(data);
  }

  showHistory(data) {
    console.log(data);
    if (this.tripFor == 'history') {
      let dialogRef = this.dialog.open(HistoryTimelineComponent, {
        // height: '100%',
        width: '500px',
        position: {
          top: '0'
        },
        data: data
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
        }
      });
    }
  }

}
