import React, { useState, useEffect, useContext } from 'react';
import { useDispatch } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import {
  Grid,
  useTheme,
  SvgIcon,
  Card,
  IconButton,
  Popover,
  MenuList,
  MenuItem,
  Button,
  Typography,
  Dialog,
  AppBar,
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Layout from '../../Layout';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import Loading from '../../../components/loader/loader';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import noimg from '../../../assets/images/Chapter-icon.png';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { Close } from '@material-ui/icons';
import axios from 'axios';
import Auth from './auth';


const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      margin: '-10px auto',
      boxShadow: 'none',
    },
    container: {
      maxHeight: '70vh',
      width: '100%',
    },
  }));

const ViewBook = (props) => {
  const classes = useStyles();
  const { setAlert } = useContext(AlertNotificationContext);
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));

  const  { bookId,chapterId,bookUid,localStorageName,environment, type}  = props;
  	let bookPath = `${environment}/${type}/`;
    let bookUrl = `${bookUid}/index.html#/reader/chapter/`;
    let localStoreName = `note_${window.location.host}ibook-static${environment}${type}${bookUid}index.html${localStorageName}`;
	let bookmarksLocalStoreName=`bookmark_${window.location.host}ibook-static${environment}${type}${bookUid}index.html${localStorageName}`;
	let highlightsLocalstoreName=`hlight_${window.location.host}ibook-static${environment}${type}${bookUid}index.html${localStorageName}`;
	
	console.log(`${window.location.origin}/qbox/${endpoints.ibook.createStudentNotes}`,'checkEndPoint')
	const dispatch = useDispatch()
	const [loading, setLoading] = useState(false);
	let notes = [];
	let highlights = [];
	let bookmarks = [];
	useEffect(() => {
		getLocalstore()
	}, [bookUrl])
	useEffect(() => {
		window.addEventListener("storage", handleLocalStoreChange)
	}, [bookUrl])

	const WaitForIFrame = () => {
		let myiFrame = document.getElementById("bookReader");
		let doc = myiFrame.contentDocument;
		if (!doc) {
			setTimeout(WaitForIFrame(), 1000);
		} else {
			var cssLink = document.createElement("link");
			cssLink.href = '../../external.css'
			cssLink.rel = "stylesheet";
			cssLink.type = "text/css";
			doc.head.appendChild(cssLink)
		}
	}

	const handleLocalStoreChange = async () => {
		console.log(notes)
		checkhighlights();
		checkbookmark();
		let local_latest_notes = window.localStorage.getItem(localStoreName)
		console.log(local_latest_notes,'local_latest_notes1')
		if (local_latest_notes) {
			if (JSON.stringify(notes) !== local_latest_notes) {
				let latest_notes = JSON.parse(local_latest_notes)
				notes = JSON.parse(local_latest_notes)
				console.log(latest_notes);
				try {
					const { role_details } = new Auth().isAuthenticated() || {}
					const { id } = role_details || {}
					const { token } = new Auth().isAuthenticated() || {}
					console.log(`${window.location.origin}/qbox/${endpoints.ibook.createStudentNotes}`,'checkEndPoint')
					const url = `${window.location.origin}/qbox/${endpoints.ibook.createStudentNotes}`;
					const formData = new FormData();
					formData.append('student', role_details.erp_user_id);
					formData.append('book', bookId);
					formData.append('localStore_name', localStoreName);
					formData.append('localStoreData', JSON.stringify(latest_notes));
					const response = await axios({
						method: 'post',
						url: url,
						data: formData,
						headers: { Authorization: `Bearer ${token}` }
					})
					const { message } = response.data
					if (message === 'success') {
						setAlert('success', 'your note is added successfully')
					}
					else {
						setAlert('error', message)
					}
				} catch (error) {
					setAlert('error', error.message)
				}
			}
		}
	}

	const checkbookmark = async () => {
		let updated_bookmarks = JSON.parse(window.localStorage.getItem(bookmarksLocalStoreName))
		if (Array.isArray(updated_bookmarks) && Array.isArray(bookmarks)) {
			if (bookmarks.length < updated_bookmarks.length) {
				let presentBookmarks = []
				updated_bookmarks.forEach((items, index) => {
					bookmarks.forEach((tempItem) => {
						if (items.location === tempItem.location && items.chapter === tempItem.chapter && items.bmid === tempItem.bmid) {
							presentBookmarks.push(index)
						}
					})
				})
				for (let index = 0; index < updated_bookmarks.length; index++) {
					if (!presentBookmarks.includes(index)) {
						try {
							const { role_details } = new Auth().isAuthenticated() || {}
							const { token } = new Auth().isAuthenticated() || {}
							console.log(`${window.location.origin}/qbox/${endpoints.ibook.studentBookmarks}`,'checkEndPoint')
							const url = `${window.location.origin}/qbox/${endpoints.ibook.studentBookmarks}`;
							const formData = new FormData();
							formData.append('student', role_details.erp_user_id);
							formData.append('book', bookId);
							formData.append('localStore_name', localStoreName);
							formData.append('bookmarkData', JSON.stringify(updated_bookmarks[index]));
							const response = await axios({
								method: 'post',
								url: url,
								data: formData,
								headers: { Authorization: `Bearer ${token}` }
							})
							const { message } = response.data
							if (message === 'success') {
								setAlert('success', 'your bookmarks is added successfully')
								console.log(updated_bookmarks[index])
								bookmarks = updated_bookmarks
							}
							else {
								setAlert('error', message)
							}
						} catch (error) {
							setAlert('error', error.message)
						}
					}
				}
			}
			if (bookmarks.length > updated_bookmarks.length) {

				let presentBookmarks = []
				bookmarks.forEach((items, index) => {
					updated_bookmarks.forEach((tempItem) => {
						if (items.location === tempItem.location && items.chapter === tempItem.chapter && items.bmid === tempItem.bmid) {
							presentBookmarks.push(index)
						}
					})
				})
				for (let index = 0; index < bookmarks.length; index++) {
					if (!presentBookmarks.includes(index)) {
						try {
							const { role_details } = new Auth().isAuthenticated() || {}
							const { token } = new Auth().isAuthenticated() || {}
							console.log(`${window.location.origin}/qbox/${endpoints.ibook.deleteBookmark}`,'checkEndPoint')
							const url = `${window.location.origin}/qbox/${endpoints.ibook.deleteBookmark}`;
							const formData = new FormData();
							formData.append('student', role_details.erp_user_id);
							formData.append('book', bookId);
							formData.append('localStore_name', localStoreName);
							formData.append('bookmarkData', JSON.stringify(bookmarks[index]));
							const response = await axios({
								method: 'delete',
								url: url,
								data: formData,
								headers: { Authorization: `Bearer ${token}` }
							})
							const { status } = response
							if (status === 204) {
								setAlert('success', 'your bookmarks is deleted successfully')
								console.log(bookmarks[index])
								bookmarks = updated_bookmarks
							}
						} catch (error) {
							setAlert('error', error.message)
						}
					}
				}
			}
		}
	}

	const checkhighlights = async () => {
		let updated_highlights = JSON.parse(window.localStorage.getItem(highlightsLocalstoreName))
		if (Array.isArray(updated_highlights) && Array.isArray(highlights)) {
			if (highlights.length < updated_highlights.length) {
				let presentHighlights = []
				updated_highlights.forEach((items, index) => {
					highlights.forEach((tempItem) => {
						if (items.location === tempItem.location && items.chapter === tempItem.chapter) {
							presentHighlights.push(index)
						}
					})
				})
				for (let index = 0; index < updated_highlights.length; index++) {
					if (!presentHighlights.includes(index)) {
						try {
							const { role_details } = new Auth().isAuthenticated() || {}
							const { token } = new Auth().isAuthenticated() || {}
							console.log(`${window.location.origin}/qbox/${endpoints.ibook.studentBooksHighlight}`,'checkEndPoint')
							const url = `${window.location.origin}/qbox/${endpoints.ibook.studentBooksHighlight}`;
							const formData = new FormData();
							formData.append('student', role_details.erp_user_id);
							formData.append('book', bookId);
							formData.append('localStore_name', localStoreName);
							formData.append('highlightData', JSON.stringify(updated_highlights[index]));
							const response = await axios({
								method: 'post',
								url: url,
								data: formData,
								headers: { Authorization: `Bearer ${token}` }
							})
							const { success, message } = response.data
							if (message === 'success') {
								setAlert('success', 'your higlight is added successfully')
								console.log(updated_highlights[index])
								highlights = updated_highlights
							}
							else {
								setAlert('error', message)
							}
						} catch (error) {
							setAlert('error', error.message)
						}
					}
				}
			}
			if (highlights.length > updated_highlights.length) {
				let presentHighlights = []
				highlights.forEach((items, index) => {
					updated_highlights.forEach((tempItem) => {
						if (items.location === tempItem.location && items.chapter === tempItem.chapter) {
							presentHighlights.push(index)
						}
					})
				})
				for (let index = 0; index < highlights.length; index++) {
					if (!presentHighlights.includes(index)) {
						try {
							const { role_details } = new Auth().isAuthenticated() || {}
							const { token } = new Auth().isAuthenticated() || {}
							console.log(`${window.location.origin}/qbox/${endpoints.ibook.deleteHighlight}`,'checkEndPoint')
							const url = `${window.location.origin}/qbox/${endpoints.ibook.deleteHighlight}`;
							const formData = new FormData();
							formData.append('student', role_details.erp_user_id);
							formData.append('book', bookId);
							formData.append('localStore_name', localStoreName);
							formData.append('highlightData', JSON.stringify(highlights[index]));
							const response = await axios({
								method: 'delete',
								url: url,
								data: formData,
								headers: { Authorization: `Bearer ${token}` }
							})
							const { status } = response
							if (status === 204) {
								setAlert('success', 'your higlight is deleted successfully')
								console.log(highlights[index])
								highlights = updated_highlights
							}
						} catch (error) {
							setAlert('error', error.message)
						}
					}
				}
			}
		}
	}

	const getLocalstore = async () => {
		try {
			setLoading(true)
			const { role_details } = new Auth().isAuthenticated() || {}
			const { token } = new Auth().isAuthenticated() || {}
			console.log(`${window.location.origin}/qbox/${endpoints.ibook.listStudentNotes}`,'checkEndPoint')
			const url = `${window.location.origin}/qbox/${endpoints.ibook.listStudentNotes}?book=${bookId}&student=${role_details.erp_user_id}`
			const result = await axios.get(url)
			console.log({result})
			localStorage.removeItem(localStoreName)
			if (result.status === 200) {
				setLoading(false)
				let tempNotes = [];
				result.data.forEach((items) => { tempNotes.push({ type: items.type, chapter: items.chapter, location: items.location, src: items.src, note: items.note, nid: items.nid }) })
				notes = tempNotes.slice()
				localStorage.setItem(localStoreName, JSON.stringify(tempNotes))
			}
			else {
				setLoading(false)
				setAlert('error', result.data.message)
			}
		} catch (error) {
			setLoading(false)
			setAlert('error', error.message)
		}
		try {
			setLoading(true)
			const { role_details } = new Auth().isAuthenticated() || {}
			const { token } = new Auth().isAuthenticated() || {}
			console.log(`${window.location.origin}/qbox/${endpoints.ibook.listBooksBookmarks}`,'checkEndPoint')
			const url = `${window.location.origin}/qbox/${endpoints.ibook.listBooksBookmarks}?book=${bookId}&student=${role_details.erp_user_id}`
			const result = await axios.get(url)
			localStorage.removeItem(bookmarksLocalStoreName)
			if (result.status === 200) {
				setLoading(false)
				let tempBookmarks = [];
				result.data.forEach((items) => { tempBookmarks.push({ chapter: items.chapter, location: items.location, bmid: items.bmid }) })
				bookmarks = tempBookmarks.slice()
				localStorage.setItem(bookmarksLocalStoreName, JSON.stringify(bookmarks))
			}
			else {
				setLoading(false)
				setAlert('error', result.data.message)
			}
		} catch (error) {
			setLoading(false)
			setAlert('error', error.message)
		}
		try {
			setLoading(true)
			const { role_details } = new Auth().isAuthenticated() || {}
			const { token } = new Auth().isAuthenticated() || {}
			console.log(`${window.location.origin}/qbox/${endpoints.ibook.listBooksHighlight}`,'checkEndPoint')
			const url = `${window.location.origin}/qbox/${endpoints.ibook.listBooksHighlight}?book=${bookId}&student=${role_details.erp_user_id}`
			const result = await axios.get(url)
			localStorage.removeItem(highlightsLocalstoreName)
			if (result.status === 200) {
				setLoading(false)
				let tempHighlight = [];
				result.data.forEach((items) => { tempHighlight.push({ chapter: items.chapter, location: items.location, src: items.src, color: items.color, hid: items.hid }) })

				highlights = tempHighlight.slice()
				localStorage.setItem(highlightsLocalstoreName, JSON.stringify(highlights))
			}
			else {
				setLoading(false)
				setAlert('error', result.data.message)
			}
		} catch (error) {
			setLoading(false)
			setAlert('error', error.message)
		}
	}


  return (
      <>
{console.log('Dynamic url', `${window.location.origin}/ibook-static/${bookPath}${bookUrl}${chapterId}?vi=0`)}
{console.log('hard coded for dev', `https://dev.olvorchidnaigaon.letseduvate.com/ibook-static/${bookPath}${bookUrl}${chapterId}?vi=0`)}

		
          <iframe
            src={`${window.location.origin}/ibook-static/${bookPath}${bookUrl}${chapterId}?vi=0`}
            // src={`https://dev.olvorchidnaigaon.letseduvate.com/ibook-static/${bookPath}${bookUrl}${chapterId}?vi=0`}
            id='bookReader'
            className='bookReader'
            style={{ width: '100%', height: '625px', margin: 'auto', paddingTop: 50 }}
            title='Tutorials'
          ></iframe>
      </>
  );
};

export default ViewBook;
