import { TestBed } from '@angular/core/testing';

import { MapsService } from './maps.service';

fdescribe('MapsService', () => {
  let service: MapsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MapsService
      ]
    });
    service = TestBed.inject(MapsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('test para posicion actual', () =>{
    it('Deberia guardar el center', () =>{
      // arrange
      spyOn(navigator.geolocation, 'getCurrentPosition')
      .and
      .callFake((success) =>{
        const mockGeolocation: GeolocationPosition = {
          coords: {
            accuracy: 0,
            altitude: 0,
            altitudeAccuracy: 0,
            heading: 0,
            latitude: 1110,
            longitude: 1210,
            speed: 0
          },
          timestamp: 0
        }
        success(mockGeolocation);
      });

      // act
      service.getCurrentPosition();

      // assert
      expect(service.center.lat).toEqual(1110);
      expect(service.center.lng).toEqual(1210);
    });
  });
});
