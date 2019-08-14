import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from './product';
import { Observable, Subject, of } from 'rxjs';
import { ProductSelect } from './productselectview';


@Injectable({
  providedIn: 'root'
})
export class ProductService {
 
  baseUrlCategory: string = 'http://localhost:8090/product-category';
  baseUrlSubCategory: string = 'http://localhost:8090/product-subCategoryId';
  baseUrlProduct: string = 'http://localhost:8090/product';
  baseUrlProductName:string="http://localhost:8090/product-name";
  baseUrlBucketProductInfoUrl="http://localhost:8090/bucketproducts";
  addProductForBucketUrl="http://localhost:8090/product/"
  httpClient:HttpClient;
  
  private selectionFormatState = new Subject<any>();
  constructor(httpClient:HttpClient) { 
   this.httpClient=httpClient;
  }


  setSet(state: any) {
   
    this.selectionFormatState.next(state);
  }

  getState(): Observable<any> {
   
    return this.selectionFormatState.asObservable();
  }
 public getProductByCategory(categoryId: string): Observable<Product[]> {
  

    return this.httpClient.get<Product[]>(this.baseUrlCategory+"/"+categoryId);
  }


  public getProductBySubCategory(subCategoryId: string): Observable<Product[]> {
  

    return this.httpClient.get<Product[]>(this.baseUrlSubCategory+"/"+subCategoryId);
  }

  public productBasedOnCode(code: string): Observable<Product> {
    
    return this.httpClient.get<Product>(this.baseUrlProduct+"/"+code);
  }

  
  public productBasedOnName(name: string): Observable<any[]> {
   
   if(name.length>2)
   {
    var productObserv= this.httpClient.get<Product[]>(this.baseUrlProductName+"?productName="+name);
    return productObserv;
   }
   else{
      return of([]);
   }
  }


  public bucketProductInfo(productIdList:string): Observable<Product[]>
  {
   
    return this.httpClient.get<Product[]>(this.baseUrlBucketProductInfoUrl+"?productIdList="+productIdList);
  }


}
