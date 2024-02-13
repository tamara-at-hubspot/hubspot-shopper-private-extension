const axios = require('axios');

exports.main = async (context = {}) => {
  const { requestUri, method = 'get', appId, requestTimeoutMillis, requestBody } = context.parameters;

  const requestBodyLog = requestBody ? JSON.stringify(requestBody) : '';
  console.log(new Date(), `proxy ${method} - ${requestUri} - ${requestBodyLog}`);
  try {
    const response = await axios({
      method,
      url: requestUri,
      data: requestBody,
      headers: {'Content-Type': 'application/json'}
    });
    const responseDataLog = response.data !== null ? JSON.stringify(response.data) : '';
    console.log(new Date(), `${response.status} - ${responseDataLog}`);
    return { status: response.status, data: response.data };
  } catch (err) {
    return { status: 502, error: `${err}` };
  }
};
