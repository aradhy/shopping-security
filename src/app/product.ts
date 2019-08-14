import { ProductAvail } from './productavail';


export class Product {
  public  code:string;
  public prodAvailId:string;
  public  productCode:string;
  public name:string ;
  public brand:string ;
  public imageLink:string;
  public  subId:string ;
  
 public productAvailList:ProductAvail[];
 public selectedProductAvail:ProductAvail;
 public itemCountList:number[]=[];
 public selectedItemCount:number=1;
 prodAddedDate:string;
}
