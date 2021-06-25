import {AfterViewInit, Component} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import * as ProtoBuf from 'protobufjs'
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

const defaultBounds = {
  minLat: -90,
  maxLat: 90,
  minLong: -180,
  maxLong: 180
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements AfterViewInit {
  private map: any;
  private heatmap: any;
  private readonly protoIpType: ProtoBuf.Type;
  private globalResultsReady: boolean = false;

  constructor(private http: HttpClient) {
    // Init protobuf types
    const ips = new ProtoBuf.Type("Ips")
      .add(new ProtoBuf.Field("ip", 1, "Ip", "repeated"))
    const ip = new ProtoBuf.Type("Ip")
      .add(new ProtoBuf.Field("latitude", 1, "float"))
      .add(new ProtoBuf.Field("longitude", 2, "float"))
      .add(new ProtoBuf.Field("weight", 3, "int32"))
    const root = new ProtoBuf.Root().define("ippackage").add(ips).add(ip);

    this.protoIpType = root
      .lookupType('ippackage.Ips');
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: center,
      zoom: 6,
      maxBoundsViscosity: 1.0,
    });

    this.map.setMaxBounds([[-90,-180], [90,180]]);

    this.setLocation();

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    tiles.addTo(this.map);
    this.heatmap = L.heatLayer([], {radius: 15, minOpacity: 0.1, gradient: gradient}).addTo(this.map);

    this.map.on({
      moveend: () => {
        if (this.globalResultsReady) return;
        let bounds = this.map.getBounds();
        const options = {
            minLat: bounds.getSouth(),
            maxLat: bounds.getNorth(),
            minLong: bounds.getWest(),
            maxLong: bounds.getEast()
          };
        this.updateHeatmap(options)
      }
    })

    this.updateHeatmap()
  }

  private updateHeatmap(bounds: any = defaultBounds){
    this.http.get('/api/ip4', { responseType: "arraybuffer", params: bounds})
      .subscribe((res: ArrayBuffer) => {
        if (this.globalResultsReady) return;
        if (bounds === defaultBounds) this.globalResultsReady = true;
        const ipJson = this.protoIpType.toObject(this.protoIpType.decode(new Uint8Array(res)))
        const ips = ipJson.ip.map((obj: any) => [obj.latitude, obj.longitude, obj.weight])
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
