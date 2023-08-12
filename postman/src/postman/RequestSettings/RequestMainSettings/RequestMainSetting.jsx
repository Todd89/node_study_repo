import React from 'react';

import './request-main-setting.css'

const RequestMainSetting = ({setSavingData, savingData}) => {
	return (
		<div className='request-main-settings'>
			<div className='request-top-settings'>
				<div className='request-method'>
					<p>Method</p>
					<select
						onChange={e => {setSavingData(data => ({...data, method: e.target.value}))}}
						defaultValue="GET"
					>
						<option selected={savingData.method === 'GET'}>GET</option>
						<option selected={savingData.method === 'POST'}>POST</option>
						<option selected={savingData.method === 'PUT'}>PUT</option>
						<option selected={savingData.method === 'DELETE'}>DELETE</option>
					</select>
				</div>
				<div className='request-url'>
					<p>URL</p>
					<input
						className='input-url'
						type="text"
						onChange={e => {
							setSavingData(data => ({ ...data, url: e.target.value }))
						}}
						value={savingData.url || 'https://'}
					/>
				</div>
			</div>
			{savingData.method === 'POST'
				&& <div className='request-body-setting'>
					<p>Body</p>
					<textarea
						className='input-body'
						onChange={e => {
							setSavingData(data => ({...data, body: e.target.value}))
						}}
					/>
				</div>
			}
		</div>
	)
}

export default RequestMainSetting;
