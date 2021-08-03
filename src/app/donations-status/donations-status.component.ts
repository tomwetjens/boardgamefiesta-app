import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {filter} from "rxjs/operators";

interface DonationsStatus {
  needs?: number;
  percent?: number;
}

@Component({
  selector: 'app-donations-status',
  templateUrl: './donations-status.component.html',
  styleUrls: ['./donations-status.component.scss']
})
export class DonationsStatusComponent implements OnInit {

  status$: Observable<DonationsStatus>;

  constructor(private httpClient: HttpClient) {
  }

  ngOnInit(): void {
    this.status$ = this.httpClient.get<DonationsStatus>(environment.apiBaseUrl + '/donations/status')
      .pipe(filter(status => !!status.needs && !!status.percent));
  }

}
