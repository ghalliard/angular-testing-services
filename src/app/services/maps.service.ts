import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MapsService {
  public center = { lat: 0, lng: 0};

  constructor() { }

  getCurrentPosition(){
    navigator.geolocation.getCurrentPosition((response: GeolocationPosition) =>{
      const { latitude, longitude } = response.coords;
      this.center.lat = latitude;
      this.center.lng = longitude;
    });
  }
}
