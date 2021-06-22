import {AfterViewInit, Component} from '@angular/core';
import {HttpClient} from "@angular/common/http";

declare var L: any;

const center = [40, -111];

const gradient = {
  '0': 'Black',
  '0.4': 'Indigo',
  '0.6': 'Purple',
  '0.8': 'Red',
  '0.95': 'Yellow',
  '1': 'White'
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements AfterViewInit {
  private map: any;
  private heatmap: any;

  constructor(private http: HttpClient) { }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: center,
      zoom: 10
    });

    this.setLocation();

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    tiles.addTo(this.map);

    this.heatmap = L.heatLayer([], {radius: 15, minOpacity: 0.1, gradient: gradient}).addTo(this.map);

    this.map.on({
      moveend: () => this.updateHeatmap()
    })
  }

  private updateHeatmap(){
    let bounds = this.map.getBounds();
    const options = { params: {
        minLat: bounds.getSouth(),
        maxLat: bounds.getNorth(),
        minLong: bounds.getWest(),
        maxLong: bounds.getEast()
      }};
    this.http.get('/api/ip4', options)
      .subscribe((res: any) => {
        const ips = res.map((obj: any) => [obj.latitude, obj.longitude, obj.weight])
        this.heatmap.setLatLngs(ips)
      });
  }

  private setLocation(): any {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position)=>{
        const longitude = position.coords.longitude;
        const latitude = position.coords.latitude;
        this.map.setView([latitude, longitude], 10);
      });
    }
  }
}
