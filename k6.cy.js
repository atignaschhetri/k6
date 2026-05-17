
import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 2,
  duration: '10s',

  thresholds: {
    http_req_failed: ['rate<0.01'],      // less than 1% request should fail
    http_req_duration: ['p(95)<3000'],   // 95% requests should finish under 3 seconds
    checks: ['rate>0.95'],               // more than 95% checks should pass
  },
};

export default function () {
  const url = 'https://dev2-backend.immigration.gov.np/api/v1/dynamic-values-setup/fetch-all?key=PurposeOfArrival';

  const res = http.get(url);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response body is not empty': (r) => r.body.length > 0,
  });

  sleep(1);
}