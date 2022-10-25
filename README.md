# Color Harmony API

Rest API for color calculations

## Conversions

Color conversion endpoints

#### Hex to other formats
`GET /api/convert/hexToRGB?hex=<hexcode>`
`GET /api/convert/hexToHSV?hex=<hexcode>`
`GET /api/convert/hexToHSL?hex=<hexcode>`
`GET /api/convert/hexToAll?hex=<hexcode>`

#### Required parameters

| Key      | Description   |
| ------------- |-------------  |
| hex       | 6 character hexcode (eg. hex=0000ff)  |

#### Example request / response
`http://localhost:3000/api/convert/hexToRGB?hex=0000ff`
```
{
    "status": 1,
    "path": "/api/convert/hexToRGB",
    "data": {
        "r": 0,
        "g": 0,
        "b": 255
    }
}
```

#### RGB to other formats
`GET /api/convert/RGBToHex?rgb=<rgb>`
`GET /api/convert/RGBToHSV?rgb=<rgb>`
`GET /api/convert/RGBToHSL?rgb=<rgb>`
`GET /api/convert/RGBToAll?rgb=<rgb>`

#### Required parameters

| Key      | Description   |
| ------------- |-------------  |
| rgb       | comma separated rgb components (eg. rgb=0,0,255)  |

#### Example response
`http://localhost:3000/api/convert/RGBtoHex?rgb=0,0,255`
```
{
    "status": 1,
    "path": "/api/convert/RGBTohex",
    "data": "00ff"
}
```

#### HSV to other formats
`GET /api/convert/HSVToHex?hsv=<hsv>`
`GET /api/convert/HSVToRGB?hsv=<hsv>`
`GET /api/convert/HSVToHSL?hsv=<hsv>`
`GET /api/convert/HSVToAll?hsv=<hsv>`

#### Required parameters

| Key      | Description   |
| ------------- |-------------  |
| hsv       | comma separated hsv components (eg. hsv=240,100,100)  |

#### Example response
`http://localhost:3000/api/convert/HSVtoRGB?hsv=240,100,100`
```
{
    "status": 1,
    "path": "/api/convert/HSVtoRGB",
    "data": {
        "r": 0,
        "g": 0,
        "b": 255
    }
}
```

#### HSL to other formats
`GET /api/convert/HSLToHex?hsl=<hsl>`
`GET /api/convert/HSLToRGB?hsl=<hsl>`
`GET /api/convert/HSLToHSV?hsl=<hsl>`
`GET /api/convert/HSLToAll?hsl=<hsl>`

#### Required parameters

| Key      | Description   |
| ------------- |-------------  |
| hsl       | comma separated hsv components (eg. hsl=240,100,50)  |

#### Example response
`http://localhost:3000/api/convert/HSLToRGB?hsl=240,100,50`
```
{
    "status": 1,
    "path": "/api/convert/HSLToRGB",
    "data": {
        "r": 0,
        "g": 0,
        "b": 255
    }
}
```