import React from 'react';

import './response-info.css'

export const ResponseInfo = ({responseInfoData}) => {
const isResponse = !!Object.keys(responseInfoData).length;
const responseHeaders = responseInfoData.headers;
const responseBody = responseInfoData.body;

return (
	<>
		{isResponse
			&& <div className='response-data-block'>
				<div className='response-data-status'><span className='info-name'>Response status:</span> {responseInfoData.status}</div>
				{!!responseHeaders.length
					&& <div className='response-headers-block'>
						<span className='info-name'>Response headers:</span>
						{responseHeaders.map((responseHeader, i) => {
							const responseHeaderKey = responseHeader[0];
							const responseHeaderValue = responseHeader[1];

							return <div className='response-data-header'>
								<div className='response-data-header-key'>- {responseHeaderKey}:</div>
								<div className='response-data-header-value'>{responseHeaderValue}</div>
							</div>
						})}
				</div>
				}
				{responseBody
					&& <div>
						<p>Response body:</p>
						<div>{responseBody.toString()}</div>
					</div>
				}
			</div>
		}
	</>
  )
}

export default ResponseInfo;
