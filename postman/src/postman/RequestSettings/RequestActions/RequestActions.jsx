import React from 'react';

import './request-actions.css';

const RequestActions = ({savingData, setSavedRequests, setResponseInfoData}) => {
	return (
		<div className='request-buttons'>
			<button className='request-button' onClick={e => {
				fetch('http://178.172.195.18:7380/saveData', {
					method: "post",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(savingData),
				})
					.then(res => {
						return res.json()
					})
					.then(res => {
						if(res.isBadRequest)
							alert('Bad saved request')
						else
							setSavedRequests(res.data)
					})
					.catch(err => console.log(err))
			}}>
				Save request
			</button>
			<button className='request-button' onClick={e => {
				fetch('http://178.172.195.18:7380/sendRequest', {
					method: "post",
					headers: {
						'Content-type': 'application/json'
					},
					body: JSON.stringify(savingData)
				})
					.then(res => {
						return res.json()
					})
					.then(res => {
						if(res.isBadRequest)
							alert('Bad send request')
						else
							setResponseInfoData(res)
					})
					.catch(err => console.log(err))
			}}>
				Send request
			</button>
			<button className='request-button'>
				Clean form
			</button>
		</div>
	)
}

export default RequestActions;
