import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';

import './file-loader.css';

const socketConnectionId = { uniqueId: null };

export const FileLoader = () => {
	const ref = useRef(null);
	const [fileLoadProgress, setFileLoadProgress] = useState(null);
	const [commentsInput, setCommentsInput] = useState('');
	const [fileInput, setFileInput] = useState(null);
	const [uploadedFiles, setUploadedFiles] = useState([]);
	const canSendData = useMemo(() => !!fileInput && !!commentsInput, [fileInput, commentsInput]);

	useEffect(() => {
		fetch('http://178.172.195.18:7380/getFilesList')
			.then(res => res.json())
			.then(json => setUploadedFiles(json.uploads))
			.catch(err => console.log(err))
	}, [])

	const setUploadedFilesList = useCallback(() => {
		return uploadedFiles.map((uploadedFile) => {
			const stringifyFileName = JSON.stringify({name: uploadedFile.originFileName});

			return <li className='file-raw' onClick={e => {
				fetch('http://178.172.195.18:7380/loadFile', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: stringifyFileName
				})
				.then(async res => {
					if(res.status !== 500) {
						const blob = await res.blob();

						const fileURL = window.URL.createObjectURL(blob);
	
						const anchor = document.createElement('a');
						anchor.href = fileURL;
						anchor.setAttribute('style', 'visibility: hidden');
						anchor.download = uploadedFile.originFileName;
		
						const body = document.getElementsByTagName('body')[0];
						body.appendChild(anchor);
	
						anchor.click();
						anchor.remove();
					} else {
						throw Error('Download Failed')
					}
				})
				.catch(err => {
					alert('Uploading error, please try to upload later')
					console.log(err)
				})
			}}>
				<div className='file-name'>{uploadedFile.originFileName}</div>
				<div className='file-description'>{uploadedFile.fileDescription}</div>
			</li>
		})
	}, [uploadedFiles])

	const sendFileWithComments = e => {
		e.preventDefault();
	
		if(!canSendData)
			return alert('Fill all inputs')
	
		const data = new FormData(e.target);
	
		const socket = new WebSocket('ws://178.172.195.18:7381');
	
		socket.addEventListener('open', (event) => { 
			const uniqueId = Date.now().toString();
			const uniqueObj = { uniqueId: uniqueId };
			socketConnectionId.uniqueId = uniqueId
	
			socket.send(JSON.stringify(uniqueObj));

			setInterval(() => {
				socket.send(JSON.stringify("KEEP_ME_ALIVE"));
			}, 500);
		});
		
		
		socket.addEventListener('message', (event) => {
			if(event.data === 'Connection established') {
				fetch('http://178.172.195.18:7380/uploadFile', {
					method: 'POST',
					headers: {
						'X-Unique-Id': socketConnectionId.uniqueId
					},
					body: data,
				})
				.then(res => {
					if(res.status !== 500) {
						return res.json()
					} else
						throw Error ('Uploading failed')
				} )
				.then(json => setUploadedFiles(json.uploads))
				.catch(err => {
					alert('Uploading failed, please try again');

					console.log(err);
				})
			} else {
				setFileLoadProgress(event.data);
			}
		});
	
		socket.addEventListener('close', (event) => {
				if (event.code !== 1005)
					alert('Uploading error, please try to upload later');

				socketConnectionId.uniqueId = null;
				setCommentsInput('');
				ref.current.value = '';
				setFileLoadProgress(null);
		});
	}

	return (
		<div className='file-loader-container'>
			<div className='file-loader-files'>
				<ol>{setUploadedFilesList()}</ol>
			</div>
			<div className='file-loader-form-container'>
				<div>
					<form
						method='post'
						action=""
						onSubmit={sendFileWithComments}
						encType='multipart/form-data'
						novalidate
					>
						<input
							type="text"
							value={commentsInput}
							onChange={e => setCommentsInput(e.target.value)}
							placeholder='Write a description'
							name='description'
						/>
						<input type="file" ref={ref} onChange={e => setFileInput(e.target.value)} name='file'/>
						<input type="submit" value="Send"/>
					</form>
					{fileLoadProgress && <div className='file-progress-bar-container'>
						<div className='file-progress-bar' style={{width: `${fileLoadProgress * 2}px`}}></div>
					</div>
					}
				</div>
			</div>
		</div>
 	)
}

export default FileLoader;

