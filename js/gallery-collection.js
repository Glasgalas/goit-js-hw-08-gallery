import images from './gallery-items.js'

const refs = {
	openModal: document.querySelector('div.lightbox'),
	closeModal: document.querySelector('button.lightbox__button'),
	lightboxOverlay: document.querySelector('.lightbox__overlay'),
	galleryContainer: document.querySelector('ul.js-gallery'),
	modalOpenGallery: document.querySelector('.lightbox__image'),
}
// перебираем массив галереи с картинками
const makeGalleryMarkup = images.map((image, index) => {
	// создаем li с классом gallery__item
	const galleryLi = document.createElement('li')
	galleryLi.classList.add('gallery__item')

	// создаем а с классом gallery__link
	const galleryLink = document.createElement('a')
	galleryLink.classList.add('gallery__link')
	galleryLink.setAttribute('href', image.original)

	// создаем img с классом gallery__image
	const galleryImg = document.createElement('img')
	galleryImg.classList.add('gallery__image')
	galleryImg.setAttribute('src', image.preview)
	galleryImg.setAttribute('data-source', image.original)
	galleryImg.setAttribute('data-index', index)
	galleryImg.setAttribute('alt', image.description)

	// создаем узлы в DOM
	galleryLink.append(galleryImg)
	galleryLi.append(galleryLink)
	return galleryLi
})

// добавляем узлы в DOM
refs.galleryContainer.append(...makeGalleryMarkup)

function onOpenModal(event) {
	event.preventDefault()
	// проверяем что клик на картинке
	if (event.target.nodeName !== 'IMG') {
		return
	}
	// добавляем класс is-open при клике на div с классом lightbox
	refs.openModal.classList.add('is-open')

	//получаем значение data-source картинки на которую кликнули
	const originalImageRef = event.target.dataset.source
	setOriginalImageSrc(originalImageRef)
}

// устанавливаем url оринальной картинки при открытии
function setOriginalImageSrc(url) {
	refs.modalOpenGallery.src = url
}

//пролистывание с клавиш <- ->
function scrollImage(event) {
	// проверяем что модальное окно открыто
	if (!refs.openModal.classList.contains('is-open')) {
		return
	}

	// собираем все объекты с тегом img
	const imgRefs = refs.galleryContainer.querySelectorAll('img')

	// ищем текущую картинку
	const currentImg = [...imgRefs].find(
		arrImg => arrImg.dataset.source === refs.modalOpenGallery.src,
	)

	// получаем индекс текущей картинки
	const currentImgIndex = Number(currentImg.dataset.index)

	// событие на кнопку вправо ->
	if (event.code === 'ArrowRight') {
		// закрываем модальное окно если дошли до конца коллекции
		if (currentImgIndex + 1 === imgRefs.length) {
			onCloseModal()
		}

		// определяем следующую картинку
		const nextImg = [...imgRefs].find(
			arrImg => Number(arrImg.dataset.index) === currentImgIndex + 1,
		)
		refs.modalOpenGallery.src = nextImg.dataset.source
	}

	// coбытие на кнопку влево <-
	if (event.code === 'ArrowLeft') {
		// закрываем модальное окно если дошли до начала коллекции
		if (currentImgIndex - 1 === -1) {
			onCloseModal()
		}

		// определяем предыдущую картинку
		const prevImg = [...imgRefs].find(
			arrImg => Number(arrImg.dataset.index) === currentImgIndex - 1,
		)
		refs.modalOpenGallery.src = prevImg.dataset.source
	}
}

// при закрытии модального окна убираем класс is-open и очищаем src
function onCloseModal() {
	refs.openModal.classList.remove('is-open')
	refs.modalOpenGallery.src = ''
}

// закрываем модальное окно при клике на пустом месте
function onOverlayClick(event) {
	if (event.target === event.currentTarget) {
		onCloseModal()
	}
}

// закрываем модальное окно при нажатии Esc
function onEscCloseModal(event) {
	if (event.code === 'Escape') {
		onCloseModal()
	}
}

// вешаем слушатели событий на клики и нажатия
refs.galleryContainer.addEventListener('click', onOpenModal)
refs.closeModal.addEventListener('click', onCloseModal)
refs.lightboxOverlay.addEventListener('click', onOverlayClick)
window.addEventListener('keydown', onEscCloseModal)
window.addEventListener('keydown', scrollImage)
