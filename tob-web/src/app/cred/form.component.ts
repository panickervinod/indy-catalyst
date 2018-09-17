import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GeneralDataService } from 'app/general-data.service';
import { Fetch, Model } from '../data-types';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'cred-form',
  templateUrl: '../../themes/_active/cred/form.component.html',
  styleUrls: [
    '../../themes/_active/cred/cred.scss',
    '../../themes/_active/cred/form.component.scss']
})
export class CredFormComponent implements OnInit, OnDestroy {
  id: number;

  private _loader = new Fetch.ModelLoader(Model.CredentialFormatted);
  private _verify = new Fetch.ModelLoader(Model.CredentialVerifyResult);
  private _idSub: Subscription;

  constructor(
    private _dataService: GeneralDataService,
    private _route: ActivatedRoute) { }

  ngOnInit() {
    this._loader.ready.subscribe(result => {
      this.verifyCred();
    });
    this._idSub = this._route.params.subscribe(params => {
      this.id = +params['credId'];
      this._dataService.loadRecord(this._loader, this.id);
    });
  }

  ngOnDestroy() {
    this._idSub.unsubscribe();
    this._loader.complete();
    this._verify.complete();
  }

  get result() {
    return this._loader.result.data;
  }

  get result$() {
    return this._loader.stream;
  }

  get verify$() {
    return this._verify.stream;
  }

  verifyCred(evt?) {
    this._dataService.loadRecord(this._verify, this.id);
  }
}
