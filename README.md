# Color Harmony API

Rest API for color calculations

## Conversions

Color conversion endpoints

#### Hex to other formats
`GET /api/convert/hexToRGB?hex=<hexcode>`<br>
`GET /api/convert/hexToHSV?hex=<hexcode>`<br>
`GET /api/convert/hexToHSL?hex=<hexcode>`<br>
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
`GET /api/convert/RGBToHex?rgb=<rgb>`<br>
`GET /api/convert/RGBToHSV?rgb=<rgb>`<br>
`GET /api/convert/RGBToHSL?rgb=<rgb>`<br>
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
`GET /api/convert/HSVToHex?hsv=<hsv>`<br>
`GET /api/convert/HSVToRGB?hsv=<hsv>`<br>
`GET /api/convert/HSVToHSL?hsv=<hsv>`<br>
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
`GET /api/convert/HSLToHex?hsl=<hsl>`<br>
`GET /api/convert/HSLToRGB?hsl=<hsl>`<br>
`GET /api/convert/HSLToHSV?hsl=<hsl>`<br>
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

## Harmonies

Color harmony endpoints

#### Available Harmonies 
`GET /api/harmony/complementary?param=<value>`
`GET /api/harmony/splitComplementary?param=<value>`
`GET /api/harmony/triadic?param=<value>`
`GET /api/harmony/tetradic?param=<value>`
`GET /api/harmony/analagous?param=<value>`

Where param = either hex, rgb, hsv or hsl
Where value = corresponding value format based on param

#### Required parameters

| Key      | Description   |
| ------------- |-------------  |
| hex **OR** rgb **OR** hsv **OR** hsl  | corresponding value format based on key  |

#### Example response
`http://localhost:3000/api/harmony/complementary?hex=0000ff`
```
{
    "status": 1,
    "path": "/api/harmony/complementary",
    "data": {
        "harmony": "complementary",
        "description": "returns the color with the hue 180 degrees from the original color",
        "source": "0000ff",
        "complementaryRGB": {
            "r": 255,
            "g": 255,
            "b": 0
        },
        "complementaryHex": "ffff0",
        "complementaryHSV": {
            "h": 60,
            "s": 100,
            "v": 100
        },
        "complementaryHSL": {
            "h": 60,
            "s": 100,
            "l": 50
        }
    }
}
```

## Color functions

Color function endpoints

#### Darken / Lighten

`GET /api/function/darken?param=<value>`<br>
`GET /api/function/lighten?param=<value>`

Where param = either hex, rgb, hsv or hsl
Where value = corresponding value format based on param

#### Required parameters
| Key      | Description   |
| ------------- |-------------  |
| hex **OR** rgb **OR** hsv **OR** hsl  | corresponding value format based on key  |

#### Optional parameters
| Key      | Description   |
| ------------- |-------------  |
| hex **OR** rgb **OR** hsv **OR** hsl  | corresponding value format based on key  |
| mode  | either 'linear' or 'log' (default of 'log') |

#### Example response
`http://localhost:3000/api/function/darken?hex=0000ff&percentage=50`
```
{
    "status": 1,
    "path": "/api/function/darken",
    "data": {
        "function": "darken",
        "mode": "log",
        "description": "the color value that is the given amount of percentage darker than the source color",
        "source": "0000ff",
        "result": {
            "rgb": {
                "r": 0,
                "g": 0,
                "b": 180
            },
            "hex": "00b4",
            "hsv": {
                "h": 240,
                "s": 100,
                "v": 70.59
            },
            "hsl": {
                "h": 240,
                "s": 100,
                "l": 35.29
            }
        }
    }
}
```


#### Random
Returns a random color in all formats
`GET /api/function/random`

#### Required parameters
No Parameters required

#### Example response
`http://localhost:3000/api/function/random`
```
{
    "status": 1,
    "path": "/api/function/random",
    "data": {
        "hex": "19806B",
        "rgb": {
            "r": 25,
            "g": 128,
            "b": 107
        },
        "hsv": {
            "h": 167.77,
            "s": 80.47,
            "v": 50.2
        },
        "hsl": {
            "h": 167.77,
            "s": 67.32,
            "l": 30
        }
    }
}
```




