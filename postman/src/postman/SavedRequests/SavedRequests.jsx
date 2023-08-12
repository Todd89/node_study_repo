import React, {useEffect} from 'react';

import './saved-requests.css'

const SavedRequests = ({savedRequests, setSavedRequests, setSavingData}) => {
	useEffect(() => {
		fetch('http://178.172.195.18:7380/getData')
		.then(res => res.json())
		.then(res => {
			setSavedRequests(res.data)
		})
		.catch(err => console.log(err))
	}, []);

	return (
		<div className='request-list'>
			{savedRequests.map((savedRequest, i) => (
					<div
						key={i}
						className='request-block'
						onClick={e => {
							fetch('http://178.172.195.18:7380/getData')
								.then(res => {
									return res.json()
								})
								.then(res => {
									console.log(res.data[i])
									setSavingData(res.data[i])
								})
								.catch(err => console.log(err))
						}}
					>
						<div className='request-param'>
							<div className='request-block-name'>Method:</div><div className='request-method'>{savedRequest.method}</div>
						</div>
						<div className='request-param'>
							<div className='request-block-name'>Url:</div><div className='request-url'>{savedRequest.url}</div>
						</div>
					</div>
				))
			}
		</div>
	)
}

export default SavedRequests;
