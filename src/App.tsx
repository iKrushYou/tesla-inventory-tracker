import './App.css';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  CssBaseline,
  Grid,
  IconButton,
  Link,
  Tooltip,
  Typography,
  CircularProgress,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip as ChartTooltip, XAxis, YAxis } from 'recharts';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
export interface InventoryResponse {
  status: boolean;
  logged_in: boolean;
  data: Car[];
  message: string;
}

export interface Car {
  id: string;
  active: string;
  vin: string;
  model: string;
  date_added: string;
  date_updated: string;
  relisted_date?: string;
  user_id: string;
  config_id: string;
  option_code_list: string;
  title_status: string;
  odometer: number;
  used_vehicle_price: number;
  option_code_list_with_price: string;
  destination_handling_fee: string;
  trade_in_type: string;
  discount: string;
  year: string;
  odometer_type: string;
  model_variant: string;
  drive_train: string;
  paint: string;
  preowned_warranty_eligibility: string;
  badge: string;
  is_panoramic: string;
  show_delivery_date: string;
  is_fixed_glass_roof: string;
  battery: string;
  metro_id: string;
  decor: string;
  range: string;
  location: string;
  features: string;
  near_by_delivery: string;
  price_change_date: string;
  sold_date: string;
  images: string[];
  vehicle_history: string;
  metro_name?: string;
  customer_car: string;
  link: string;
  warranty: string;
  prices: PriceInfo[];
  class: string;
  status: string;
}

export interface PriceInfo {
  id: string;
  vin: string;
  date_of: string;
  price: string;
  active: string;
}

type CarType = 'M3LR' | 'M3P' | 'MYLR' | 'MYP';

const searchParams: Record<CarType, string> = {
  MYLR:
    'https://teslacpo.io/api/?action=query&sort=used_vehicle_price%20ASC&model=my&sold=2&filter=&vin=&status=used&features[]=Long%20Range%20All-Wheel%20Drive',
  MYP:
    'https://teslacpo.io/api/?action=query&sort=used_vehicle_price%20ASC&model=my&sold=2&filter=&vin=&status=used&features[]=Performance%20Upgrade',
  M3LR:
    'https://teslacpo.io/api/?action=query&sort=used_vehicle_price%20ASC&model=MODEL_3&sold=2&filter=&vin=&status=used&features[]=Long%20Range%20All-Wheel%20Drive',
  M3P:
    'https://teslacpo.io/api/?action=query&sort=used_vehicle_price%20ASC&model=MODEL_3&sold=2&filter=&vin=&status=used&features[]=Performance%20Upgrade',
};

const getCarImageUrl = (car: Car) => {
  const model = car.model === 'my' ? 'my' : 'm3';
  const view = car.model === 'my' ? 'FRONT34' : 'STUD_3QTR';
  return `https://static-assets.tesla.com/configurator/compositor?context=design_studio_2&options=${car.option_code_list}&view=${view}&model=${model}&size=1920&bkba_opt=2&crop=0,0,0,0&`;
};

async function fetchTeslaInventory(carType: CarType): Promise<Car[]> {
  const response: InventoryResponse = await fetch(searchParams[carType], {
    // body:
    //   'action=query&sort=used_vehicle_price%20ASC&model=my&sold=2&filter=&vin=&status=used&features[]=Performance%20Upgrade',
    cache: 'default',
    credentials: 'omit',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.9',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: 'POST',
    mode: 'cors',
    redirect: 'follow',
    referrer: 'https://preusedev.com/',
    referrerPolicy: 'strict-origin-when-cross-origin',
  }).then((res) => res.json());
  return response.data;
}

function getCarUrl(car: Car) {
  const model = car.model === 'my' ? 'my' : 'm3';
  return `https://www.tesla.com/${model}/order/${car.vin}`;
}

function filterCars(cars: Car[], invert: boolean): Car[] {
  return (
    cars
      .sort((a, b) => a.used_vehicle_price - b.used_vehicle_price)
      // .filter((car) => car.badge.includes('Performance Dual Motor All-Wheel Drive'))
      .filter((car) => {
        if (
          // car.year === 2022
          // car.vin.slice(-7, -6) === 'F' &&
          // parseInt(car.vin.slice(-6)) > 370000 &&
          car.features.includes('Enhanced Autopilot') ||
          car.features.includes('Full Self')
        ) {
          return !invert;
        } else {
          return invert;
        }
      })
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [cars, setCars] = useState<Car[]>([]);

  const [carType, setCarType] = useState<CarType>('M3LR');

  useEffect(() => {
    setIsLoading(true);
    fetchTeslaInventory(carType)
      .then((data) => setCars(data))
      .finally(() => setIsLoading(false));
  }, [carType]);

  const filteredCars: Car[] = filterCars(cars, false);
  const otherCars: Car[] = filterCars(cars, true);

  return (
    <Box bgcolor={'#eee'} p={'20px'}>
      <CssBaseline />
      <Container maxWidth={'xl'}>
        <Box mb={'20px'}>
          <ToggleButtonGroup value={carType} exclusive onChange={(event, value) => setCarType(value)}>
            <ToggleButton value="M3LR">M3LR</ToggleButton>
            <ToggleButton value="M3P">M3P</ToggleButton>
            <ToggleButton value="MYLR">MYLR</ToggleButton>
            <ToggleButton value="MYP">MYP</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Typography variant={'h4'} mb={'20px'}>
          Results with FSD
        </Typography>
        {isLoading ? (
          <Box>
            <CircularProgress />
          </Box>
        ) : (
          <CarGridView cars={filteredCars} />
        )}
        <Typography variant={'h4'} mb={'20px'} mt={'20px'}>
          Other Results
        </Typography>
        {isLoading ? (
          <Box>
            <CircularProgress />
          </Box>
        ) : (
          <CarGridView cars={otherCars} />
        )}
      </Container>
    </Box>
  );
}

function CarGridView({ cars }: { cars: Car[] }) {
  return (
    <Box>
      <Typography variant={'h6'} mb={'20px'}>
        ({cars.length} Results)
      </Typography>
      <Grid container spacing={2}>
        {/*<Box display={'flex'} gap={'20px'} flexWrap={"wrap"} justifyContent={'center'}>*/}
        {cars.map((car) => {
          const carFeatures = car.features
            .split('<br/>')
            .filter(
              (x) =>
                x !== 'Basic Autopilot' &&
                x !== 'Premium Interior' &&
                x !== 'Performance Pedals' &&
                x !== 'Model Y' &&
                x !== 'Performance All-Wheel Drive' &&
                x !== 'Performance Upgrade' &&
                x !== 'Carbon Fiber Spoiler' &&
                x !== 'Performance Brakes' &&
                x !== 'Dual Motor All-Wheel Drive' &&
                !x.includes('Supercharger') &&
                !x.includes('Wheels')
            );

          return (
            <Grid item sm={12} md={6} lg={4} key={car.vin}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box display={'flex'} justifyContent={'space-between'} mb={'-5px'}>
                    <Typography variant={'h5'}>
                      {car.year} {car.model === 'my' ? 'Model Y' : 'Model 3'}
                    </Typography>
                    <Typography variant={'h5'}>${car.used_vehicle_price}</Typography>
                  </Box>
                  <Typography variant={'caption'} mb={'10px'}>
                    {car.badge}
                  </Typography>
                  <Box display={'flex'} justifyContent={'space-between'}>
                    <Typography>{car.odometer} miles</Typography>
                    <Tooltip title={`added on ${car.date_added}`}>
                      <Typography>
                        Listing Age: {DateTime.now().diff(DateTime.fromSQL(car.date_added)).shiftTo('days').toHuman()}
                      </Typography>
                    </Tooltip>
                  </Box>
                  <Typography>{car?.location?.length > 0 ? car.location : 'N/A'}</Typography>
                  <Box display={'flex'} justifyContent={'space-between'}>
                    <Box display={'flex'}>
                      <Typography>
                        <Link href={getCarUrl(car)} target={'_blank'}>
                          {car.vin}
                        </Link>
                      </Typography>
                      <IconButton size={'small'} onClick={() => navigator.clipboard.writeText(car.vin)}>
                        <ContentCopyIcon fontSize={'small'} />
                      </IconButton>
                    </Box>
                    <form action={'https://tesla-info.com/tesla-build-date.php'} method={'post'} target={'_blank'}>
                      <input type={'hidden'} name={'vin'} id={'vin'} value={car.vin} />
                      <Button type={'submit'} size={'small'}>
                        Build Date
                      </Button>
                    </form>
                  </Box>
                  <Box
                    display={'flex'}
                    justifyContent={'center'}
                    height={'200px'}
                    alignItems={'center'}
                    overflow={'hidden'}
                  >
                    <Box
                      component={'img'}
                      src={getCarImageUrl(car)}
                      width={'100%'}
                      maxHeight={['300px']}
                      sx={{ objectFit: 'contain' }}
                    />
                  </Box>
                  <Box height={'150px'}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={car.prices
                          .sort((a, b) => new Date(a.date_of).getTime() - new Date(b.date_of).getTime())
                          .map((price) => ({
                            price: price.price,
                            date: DateTime.fromSQL(price.date_of).toLocaleString(DateTime.DATETIME_SHORT),
                          }))}
                        margin={{
                          top: 5,
                          right: 30,
                          // left: 20,
                          bottom: 5,
                        }}
                      >
                        <XAxis dataKey="date" />
                        <YAxis domain={['dataMin - 1000', 'dataMax + 1000']} />
                        <ChartTooltip />
                        {/*<Legend/>*/}
                        <Line type="monotone" dataKey="price" stroke="#8884d8" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                  <Grid container>
                    {carFeatures.map((feature) => (
                      <Grid item xs={6} key={feature}>
                        <Typography key={feature} variant={'caption'}>
                          {feature}
                        </Typography>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

export default App;
