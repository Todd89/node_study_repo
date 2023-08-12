import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import './request-params.css'

const RequestParams = ({setSavingData}) => {
	const [params, setParams] = useState([]);

	const addParam = e => setParams(params => {
		const id = uuidv4();

		return [...params, {
			id,
			name: "",
			value: "",
		}]
	});


	const deleteParam = id => e => {
		const indexOfParam = params.findIndex(param => param.id === id);

		params.splice(indexOfParam, 1);

		setParams([...params])
	}

	const submitParams = e => {
		e.preventDefault();

		setSavingData(data => ({...data, params: []}));
		const params = e.target.elements;
		const paramsArray = Array.from(params);

		const isBadParam = paramsArray.some((param, i) => {
			return !param.value && i !== paramsArray.length - 1;
		});

		if(isBadParam)
			return alert('There is a bad param')

		paramsArray.forEach((param, i) => {
			if((i === 0 || i % 2 === 0) && i !== paramsArray.length - 1) {
				setSavingData(data => {
					const newParam = {
						name: param.value,
						value: paramsArray[i + 1].value
					}
					return {...data, params: [...data.params, newParam]}
				})
			}
		})

		setParams([])
	} 

	return (
		<form onSubmit={submitParams}>
			<div className='request-params'>
				{params.length
					? params.map(param => (
						<div className='param'>
								<div>
									<input type='text' id="name"></input>
								</div>
								<div>
									<input type='text' id="value"></input>
								</div>
								<div
									className='delete-param'
									onClick={deleteParam(param.id)}
								>
									Delete
								</div>
						</div>
					))
					: null
				}
				<div
					className='request-params-button'
					onClick={addParam}
				>
					Add Param
				</div>
			{params.length
				? <button
						className='submit-params'
						type="submit"
					>
						Submit Params
					</button>
				: null
			}
			</div>
		</form>
	)
		
}

export default RequestParams;
