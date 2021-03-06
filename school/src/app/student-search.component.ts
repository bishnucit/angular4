import { Component, OnInit } from '@angular/core';
// Observable class extensions
import 'rxjs/add/observable/of';

// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { Subject }           from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Student } from './student';
import { Router } from '@angular/router';
import { StudentSearchService } from './student-search.service';
import 'rxjs/add/operator/switchMap';


@Component({
  selector: 'student-search',
  templateUrl: './student-search.component.html',
  styleUrls: ['./student-search.component.css']
})
export class StudentSearchComponent implements OnInit {
  students: Observable<Student[]>;
  private searchTerms = new Subject<string>();
  
  constructor(
    private studentSearchService: StudentSearchService,
    private router: Router
  ) { }

  //push a search term into theobservable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.students = this.searchTerms
      .debounceTime(300)        // wait 300ms after each keystroke before considering the term
      .distinctUntilChanged()   // ignore if next search term is same as previous
      .switchMap(term => term   // switch to new observable each time the term changes
        // return the http search observable
        ? this.studentSearchService.search(term)
        // or the observable of empty heroes if there was no search term
        : Observable.of<Student[]>([]))
      .catch(error => {
        // TODO: add real error handling
        console.log(error);
        return Observable.of<Student[]>([]);
      });
  }


  gotoDetail(student: Student): void {
    let link = ['/detail', student.id];
    this.router.navigate(link);
  }

}
