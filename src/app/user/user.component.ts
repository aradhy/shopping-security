import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

declare var onClickSubmit:any;

@Component({
  selector: 'user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})


export class UserComponent implements OnInit {

  paramVal:string;
  constructor(private router:Router,private activatedRoute:ActivatedRoute) 
  {  

  }

  ngOnInit() {
  
    
    this.activatedRoute.params.subscribe(params => {
      this.paramVal = params.id; 
    
    });
 
   onClickSubmit(this.paramVal);
  }

  changeForm(paramVal)
  {
    this.paramVal=paramVal
  }
  close()
  {
    document.getElementById('id01').style.display='none';
    this.router.navigateByUrl('/');
  }
}
