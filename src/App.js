import './App.css';
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    CardMedia,
    Chip,
    CssBaseline,
    Link,
    Tooltip,
    Typography
} from "@mui/material";
import {DateTime} from "luxon";
import {useEffect, useState} from "react";
import {Line, LineChart, ResponsiveContainer, Tooltip as ChartTooltip, XAxis, YAxis} from "recharts";

async function fetchTeslaInventory() {
    const response = await fetch("https://teslacpo.io/api/?action=query&sort=used_vehicle_price%20ASC&model=my&sold=2&filter=&vin=&status=used&features[]=Performance%20Upgrade", {
        "body": "action=query&sort=used_vehicle_price%20ASC&model=my&sold=2&filter=&vin=&status=used&features[]=Performance%20Upgrade",
        "cache": "default",
        "credentials": "omit",
        "headers": {
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "en-US,en;q=0.9",
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15"
        },
        "method": "POST",
        "mode": "cors",
        "redirect": "follow",
        "referrer": "https://preusedev.com/",
        "referrerPolicy": "strict-origin-when-cross-origin"
    }).then(res => res.json())
    return response.data;
}

async function fetchInventory() {
    var myHeaders = new Headers();
    myHeaders.append("Accept", "*/*");
    myHeaders.append("Sec-Fetch-Site", "same-origin");
    myHeaders.append("Cookie", "_gali=WHEELS%3ATWENTY_ONE; _ga=GA1.2.1909611737.1697207395; _ga_KFP8T9JWYJ=GS1.1.1700235818.34.1.1700235965.59.0.0; _gid=GA1.2.545588973.1700151268; _uetsid=379bd110849b11ee8287070545cbf255; _uetvid=7cb4eca0827d11eebdf98b212e04e081; bm_sv=E4F07793422C2FC1C06F7E798384BFD1~YAAQjGvcF/fN492LAQAAHvX13RWtanIRAS+hDruO5k26fDkjVzW6hHfCREi5DPRhP/+DX6keyIABFXyLxwXM2REYXb4mpuI9X7jW5b8aRiRDaNC8GjGkjWyPTNphJKTzu1GXA0Sqnj0edNqInYHUuvs/1jf/3roh7FYfdzvU1dppYNqCI8QbSlFd6ILB+7NTe3jeht/RXr7O5DpONqXYF88odvhnmrsatAT/+uvFX1W8WoluFYw/5vkezczqsvT5~1; _clsk=2p36l7%7C1700235964827%7C3%7C0%7Cy.clarity.ms%2Fcollect; _gat_UA-9152935-1=1; coin_auth_inventory=609a716f9411f48045ae644bd6a075b2; cua_sess=3a84237bff39c701fb99a7bc4d7dca2e; _ga_2RWV2RY971=GS1.1.1700235823.34.1.1700235936.0.0.0; _gcl_au=1.1.776610663.1695327926; ak_bmsc=FC998179777E316C1475667E2BA75A0E~000000000000000000000000000000~YAAQlWvcF5UeG92LAQAAG3Sn3RXMbRNd9dlU63BJMJEgyZHmwKtN5pwDFRE1XALnGf8lXvLlObXKeq511T7AfZK0L3gD79yoqHJww6K/h7QCRUyVPozd5FoCP+CbBcDDIwWuZYlVOY2u25VHjZb/KuYSyMygJZZldFfuwRE5WD4dTBKKrpDiPl8Ptcx7Em8bQpJjNSp/HKpe4eGiaI7N7p82uw7P8lsw7AkLGmDQapEWeUMY5mMV0oDurUgNqJ4szQaf3hf3f2uPJ93DMwIWCNGpGYnecOx7tYy1Z2UujG8tb5BdgEauuNKzJXHqg31/QeJ34wvCmAJtTYASt6re0oVZbJrJ95NuyAai7GdgDS+pnBQhAGdt94QqBOMFXObz2XE5LaQhVvtgPTTD//CJT5iwG2fNWB45QwR+I+50xcaVM81pQ09T5uqsbJ6Xshj6u4KOuqF/FZUYwU+qeU54xDAa1+74iG4hwkqpib66GKM7pznbvbccaDanXrtF8z+zL0G8PQMbOgo=; _clck=a1i1dg|2|fgs|0|1415; coin_auth=00e70dff017db6e504f4f4dfcbf8acad; RT=\"z=1&dm=tesla.com&si=v1c15z5h4cb&ss=lopz7zb2&sl=0&tt=0\"; ip_info={\"ip\":\"2620:149:13dc:300::8\",\"location\":{\"latitude\":37.751,\"longitude\":-97.822},\"region\":null,\"city\":\"\",\"country\":\"United States\",\"countryCode\":\"US\",\"postalCode\":\"\"}; _abck=ED917541D5FDB9A516F7196DF17B42AF~0~YAAQlWvcF1NVKGyLAQAAm396cQoAmxPVovsMnfgyfqF7MEm8mdNfDEPjpbyFlz9H+Ynf4Uadb++PA+YNTl9n8SnwF5xbH5SIREkLsmDgobkEkyNMV3QFUqVQGzkfeVihj608H74jLD+yAkhTzz2G/CJ1lPUX4bOfH/n5CJuTUoAKAQQk9Wou6yUAoFQGsLGCMsGMOFzcF0U1ah5RUpDolguqzxHj33tNxDN9EIHTJpgwbedzMdZX88TC9GjGz72U2LPVCF+gsWNGQdXp6Z2q3Bm+BsvYDKy/L6YFE4EMfKgEF750cMRKJR3HX0d0XZ+g0JszZCO2Y0G4GxD+voyJV+/dypFiQGSfsAnpmBUkqaLjEricqf5adVre99WpdbSaoj6zyDiTYTx+SuDNhA+wGzonxgEZoXyb~-1~-1~1698419517; _ga_3L69Y2VKNN=GS1.1.1697056661.1.1.1697056934.0.0.0; _gaexp=GAX1.2.Luz2PclzSY2fqpUwAlE1uw.19714.0");
    myHeaders.append("Sec-Fetch-Dest", "empty");
    myHeaders.append("Accept-Language", "en-US,en;q=0.9");
    myHeaders.append("Sec-Fetch-Mode", "cors");
    myHeaders.append("Host", "www.tesla.com");
    myHeaders.append("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15");
    myHeaders.append("Referer", "https://www.tesla.com/inventory/used/my?TRIM=PAWD&Year=2022&arrangeby=plh&zip=90210");
    myHeaders.append("Accept-Encoding", "gzip, deflate, br");
    myHeaders.append("Connection", "keep-alive");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    return await fetch("https://www.tesla.com/inventory/api/v4/inventory-results?query=%7B%22query%22%3A%7B%22model%22%3A%22my%22%2C%22condition%22%3A%22used%22%2C%22options%22%3A%7B%22TRIM%22%3A%5B%22PAWD%22%5D%2C%22Year%22%3A%5B%222022%22%5D%7D%2C%22arrangeby%22%3A%22Price%22%2C%22order%22%3A%22asc%22%2C%22market%22%3A%22US%22%2C%22language%22%3A%22en%22%2C%22super_region%22%3A%22north%20america%22%2C%22lng%22%3A-118.4104684%2C%22lat%22%3A34.1030032%2C%22zip%22%3A%2290210%22%2C%22range%22%3A0%2C%22region%22%3A%22CA%22%7D%2C%22offset%22%3A0%2C%22count%22%3A50%2C%22outsideOffset%22%3A0%2C%22outsideSearch%22%3Afalse%2C%22isFalconDeliverySelectionEnabled%22%3Afalse%2C%22version%22%3Anull%7D", requestOptions)
        .then(response => response.json())
        .catch(error => console.log('error', error));
}

function getCarUrl(car) {
    return `https://www.tesla.com/my/order/${car.vin}`
}

function App() {

    const [cars, setCars] = useState([])

    useEffect(() => {
        fetchTeslaInventory().then(data => setCars(data))
    }, []);

    const filteredCars = []
    const otherCars = []

    cars
        // .map(car => ({
        //     location: car.MetroName,
        //     interior: car.INTERIOR.join(", "),
        //     price: car.TotalPrice,
        //     odometer: car.Odometer,
        //     color: car.PAINT.join(", "),
        //     vin: car.VIN,
        //     url: `https://www.tesla.com/my/order/${car.VIN}`,
        //     year: car.Year,
        //     additionalOptions: car.ADL_OPTS,
        //     autopilot: car.AUTOPILOT,
        //     originalDeliveryDate: DateTime.fromISO(car.OriginalDeliveryDate),
        //     factoryDate: DateTime.fromISO(car.FactoryGatedDate),
        //     trim: car.TRIM.join(", "),
        //     HardwareOptionCodeList: car.HardwareOptionCodeList,
        //     TitleReceivedOwnershipTransferDate: DateTime.fromISO(car.TitleReceivedOwnershipTransferDate),
        //     listingDuration: DateTime.now().diff(DateTime.fromISO(car.TitleReceivedOwnershipTransferDate)).shiftTo('days'),
        // }))
        .sort((a, b) => a.price - b.price)
        // .sort((a, b) => b.factoryDate.toMillis() - a.factoryDate.toMillis())
        .filter(car => car.badge.includes("Performance Dual Motor All-Wheel Drive"))
        .forEach(car => {
            if (
                // car.year === 2022
                (car.vin.slice(-7, -6) === "F" && parseInt(car.vin.slice(-6)) > 370000)
            ) {
                filteredCars.push(car)
            } else {
                otherCars.push(car)
            }
        })

    console.log(filteredCars)
    console.log(otherCars)

    return (
        <>
            <CssBaseline/>
            <Box p={["20px", "40px"]} bgcolor={'#eeeeeb'}>
                <Box mb={'20px'}>
                    <Link
                        href={"https://www.tesla.com/inventory/api/v4/inventory-results?query=%7B%22query%22%3A%7B%22model%22%3A%22my%22%2C%22condition%22%3A%22used%22%2C%22options%22%3A%7B%22TRIM%22%3A%5B%22PAWD%22%5D%2C%22Year%22%3A%5B%222022%22%5D%7D%2C%22arrangeby%22%3A%22Price%22%2C%22order%22%3A%22asc%22%2C%22market%22%3A%22US%22%2C%22language%22%3A%22en%22%2C%22super_region%22%3A%22north%20america%22%2C%22lng%22%3A-118.4104684%2C%22lat%22%3A34.1030032%2C%22zip%22%3A%2290210%22%2C%22range%22%3A0%2C%22region%22%3A%22CA%22%7D%2C%22offset%22%3A0%2C%22count%22%3A50%2C%22outsideOffset%22%3A0%2C%22outsideSearch%22%3Afalse%2C%22isFalconDeliverySelectionEnabled%22%3Afalse%2C%22version%22%3Anull%7D"}
                        target={"_blank"}>Data Link (save with option + click)</Link>
                </Box>
                {[{cars: filteredCars, title: 'Potentially HW3'}, {cars: otherCars, title: 'Other Results'}]
                    .map(({
                              cars,
                              title
                          }, index) => (
                        <Box key={index}>
                            <Typography variant={'h4'} mb={'20px'}>{title} ({cars.length} Results)</Typography>
                            <Box display={'flex'} gap={'20px'} flexWrap={"wrap"} justifyContent={'center'}>
                                {cars.map(car => {
                                    const carFeatures = car.features.split("<br/>").filter(
                                        x => x !== "Basic Autopilot"
                                            && x !== "Premium Interior"
                                            && x !== "Performance Pedals"
                                            && x !== "Model Y"
                                            && x !== "Performance All-Wheel Drive"
                                            && x !== "Performance Upgrade"
                                            && x !== "Carbon Fiber Spoiler"
                                            && x !== "Performance Brakes"
                                            && x !== "Dual Motor All-Wheel Drive"
                                            && !x.includes("Supercharger")
                                            && !x.includes("Wheels")
                                    )
                                    console.log(car.prices.map((price) => new Date(price.date_of)))

                                    return (
                                        <Card key={car.vin} sx={{maxWidth: ['100%', 300]}}>
                                            <CardHeader
                                                title={`${car.year}`}
                                                subheader={car.badge}
                                            />
                                            <CardMedia component={"img"}
                                                       image={`https://static-assets.tesla.com/configurator/compositor?context=design_studio_2&options=${car.option_code_list}&view=FRONT34&model=my&size=600&bkba_opt=2&crop=0,0,0,0&`}
                                            />
                                            <CardContent>
                                                <Typography variant={'h5'}>${car.used_vehicle_price}</Typography>

                                                <Box height={'150px'}>
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <LineChart
                                                            data={car.prices.sort((a, b) => new Date(a.date_of).getTime() - new Date(b.date_of).getTime()).map(price => ({price: price.price, date: DateTime.fromSQL(price.date_of).toLocaleString(DateTime.DATETIME_SHORT)}))}
                                                            margin={{
                                                                top: 5,
                                                                right: 30,
                                                                // left: 20,
                                                                bottom: 5,
                                                            }}
                                                        >
                                                            <XAxis dataKey="date"/>
                                                            <YAxis domain={['dataMin - 1000', 'dataMax + 1000']}/>
                                                            <ChartTooltip/>
                                                            {/*<Legend/>*/}
                                                            <Line type="monotone" dataKey="price" stroke="#8884d8" activeDot={{r: 8}}/>
                                                        </LineChart>
                                                    </ResponsiveContainer>
                                                </Box>
                                                <Typography>{car.odometer} miles</Typography>
                                                <Typography><Link href={getCarUrl(car)}
                                                                  target={"_blank"}>{car.vin}</Link></Typography>
                                                {/*<Typography>Factory*/}
                                                {/*    Date: {car.factoryDate.toLocaleString(DateTime.DATE_MED)}</Typography>*/}
                                                {/*<Typography>Delivery*/}
                                                {/*    Date: {car.originalDeliveryDate.toLocaleString(DateTime.DATE_MED)}</Typography>*/}
                                                {/*<Typography>Car Age: {DateTime.now().diff(car.factoryDate).shiftTo('years').toHuman()}</Typography>*/}
                                                <Tooltip title={`added on ${car.date_added}`}>
                                                <Typography>Listing Age: {DateTime.now().diff(DateTime.fromSQL(car.date_added)).shiftTo('weeks').toHuman()}</Typography>
                                                </Tooltip>
                                                <Box display={'flex'} gap={'10px'} flexWrap={'wrap'}>
                                                    {carFeatures.map(option => <Chip key={option} label={option}/>)}
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </Box>
                        </Box>
                    ))}
            </Box>
        </>
    );
}

export default App;
