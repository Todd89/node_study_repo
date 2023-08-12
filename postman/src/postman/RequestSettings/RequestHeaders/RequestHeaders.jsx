import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import './request-headers.css'

const RequestHeaders = ({setSavingData}) => {
	const [headers, setHeaders] = useState([]);
	const [isHeadersSubmitted, setIsHeadersSubmitted] = useState(false)

	const addHeader = e => setHeaders(header => {
		const id = uuidv4();

		return [...header, {
			id,
			name: "",
			value: "",
		}]
	});

	const deleteHeader = id => e => {
		const indexOfParam = headers.indexOf(header => header.id === id);

		headers.splice(indexOfParam, 1);

		setHeaders([...headers])
	}

	const submitHeaders = e => {
		e.preventDefault();

		const headers = e.target.elements;
		const headersArray = Array.from(headers);

		const isBadParam = headersArray.some((param, i) => {
			return !param.value && i !== headersArray.length - 1;
		});

		if(isBadParam)
			return alert('There is a bad header');


		const newHeaders = headersArray.map((header, i) => {
			if((i === 0 || i % 2 === 0) && i !== headersArray.length - 1) {
				const newHeader = {
					name: header.value,
					value: headersArray[i + 1].value
				}

				return newHeader;
			}
		})

		const filteredNewHeaders = newHeaders.filter(newHeader => newHeader);

		setSavingData(data => ({...data, headers: [...[], ...filteredNewHeaders]}));

		setIsHeadersSubmitted(true);

		setHeaders([]);
	} 

	return (
		<form onSubmit={submitHeaders}>
			<div className='request-headers'>
				{headers.length
					? headers.map(header => (
						<div  className='header'>
							<div>
								<input type='text'></input>
							</div>
							<div>
								<input type='text'></input>
							</div>
							<div
								className='delete-header'
								onClick={deleteHeader(header)}
							>
								Delete
							</div>
						</div>
					))
					: null
				}
				<div className='request-header-buttons'>
					<div
						className='request-header-button'
						onClick={addHeader}
					>
						Add Header
					</div>
					{headers.length
						? <button
								className='submit-params'
								type="submit"
							>
								Submit headers
							</button>
						: null
					}
					{isHeadersSubmitted
						? <div className='submit-info'>"Success submit"</div>
						: null
					}
					</div>
			</div>
		</form>
	)
		
}

export default RequestHeaders;
