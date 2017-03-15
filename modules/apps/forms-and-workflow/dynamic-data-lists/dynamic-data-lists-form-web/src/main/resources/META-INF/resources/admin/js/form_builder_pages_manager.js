AUI.add(
	'liferay-ddl-form-builder-pages-manager',
	function(A) {
		var CSS_FORM_BUILDER_CONTROLS_TRIGGER = A.getClassName('form', 'builder', 'controls', 'trigger');

		var CSS_FORM_BUILDER_PAGE_MANAGER_ADD_PAGE_LAST_POSITION = A.getClassName('form', 'builder', 'page', 'manager', 'add', 'last', 'position');

		var CSS_FORM_BUILDER_PAGE_MANAGER_ADD_SUCCESS_PAGE = A.getClassName('form', 'builder', 'page', 'manager', 'add', 'success', 'page');

		var CSS_FORM_BUILDER_PAGE_MANAGER_DELETE_PAGE = A.getClassName('form', 'builder', 'page', 'manager', 'delete', 'page');

		var CSS_FORM_BUILDER_PAGE_MANAGER_REMOVE_SUCCESS_PAGE = A.getClassName('form', 'builder', 'page', 'manager', 'remove', 'success', 'page');

		var CSS_FORM_BUILDER_PAGE_MANAGER_SWITCH_MODE = A.getClassName('form', 'builder', 'page', 'manager', 'switch', 'mode');

		var CSS_FORM_BUILDER_PAGE_POPOVER_CONTENT = A.getClassName('form', 'builder', 'pages', 'popover', 'content');

		var CSS_FORM_BUILDER_PAGES_CONTENT = A.getClassName('form', 'builder', 'page', 'manager', 'content');

		var CSS_FORM_BUILDER_PAGINATION = A.getClassName('form', 'builder', 'pagination');

		var CSS_FORM_BUILDER_SUCCESS_PAGE = A.getClassName('form', 'builder', 'success', 'page');

		var CSS_FORM_BUILDER_SUCCESS_PAGE_DESCRIPTION = A.getClassName('form', 'builder', 'success', 'page', 'description');

		var CSS_FORM_BUILDER_SUCCESS_PAGE_TITLE = A.getClassName('form', 'builder', 'success', 'page', 'title');

		var CSS_FORM_BUILDER_TABVIEW = A.getClassName('form', 'builder', 'tabview');

		var CSS_LAYOUT = A.getClassName('form', 'builder', 'layout');

		var CSS_PAGE_HEADER = A.getClassName('form', 'builder', 'page', 'header');

		var CSS_PAGE_HEADER_DESCRIPTION = A.getClassName('form', 'builder', 'page', 'header', 'description');

		var CSS_PAGE_HEADER_DESCRIPTION_HIDE_BORDER = A.getClassName('form', 'builder', 'page', 'header', 'description', 'hide', 'border');

		var CSS_PAGE_HEADER_TITLE = A.getClassName('form', 'builder', 'page', 'header', 'title');

		var CSS_PAGE_HEADER_TITLE_HIDE_BORDER = A.getClassName('form', 'builder', 'page', 'header', 'title', 'hide', 'border');

		var FormBuilderPagesManager = A.Component.create(
			{
				ATTRS: {
					builder: {
					},

					mode: {
						validator: '_validateMode',
						value: 'pagination'
					},

					strings: {
						value: {
							addPageLastPosition: Liferay.Language.get('add-new-page'),
							addSuccessPage: Liferay.Language.get('add-success-page'),
							aditionalInfo: Liferay.Language.get('add-a-short-description-for-this-page'),
							deleteCurrentPage: Liferay.Language.get('delete-current-page'),
							description: Liferay.Language.get('description'),
							removeSuccessPage: Liferay.Language.get('remove-success-page'),
							resetPage: Liferay.Language.get('reset-page'),
							switchMode: Liferay.Language.get('switch-pagination-mode'),
							title: Liferay.Language.get('title'),
							untitledPage: Liferay.Language.get('untitled-page-x-of-x')
						},
						writeOnce: true
					}
				},

				CSS_PREFIX: 'form-builder-page-manager',

				NAME: 'liferay-ddl-form-builder-pages-manager',

				EXTENDS: A.FormBuilderPageManager,

				prototype: {
					TPL_PAGES: '<div class="' + CSS_FORM_BUILDER_PAGES_CONTENT + '">' +
						'<div class="' + CSS_FORM_BUILDER_PAGINATION + '"></div>' +
					'</div>',

					TPL_PAGE_CONTROL_TRIGGER:
						'<a class="' + CSS_FORM_BUILDER_CONTROLS_TRIGGER + '" data-position="{position}" href="javascript:;">' +
							Liferay.Util.getLexiconIconTpl('ellipsis-v') +
						'</a>',

					TPL_PAGE_HEADER: '<div class="' + CSS_PAGE_HEADER + ' form-inline">' +
						'<textarea rows="1" placeholder="{untitledPage}" class="' + CSS_PAGE_HEADER_TITLE + ' ' +
						CSS_PAGE_HEADER_TITLE_HIDE_BORDER + ' form-control"></textarea>' +
						'<textarea rows="1" placeholder="{aditionalInfo}" class="' + CSS_PAGE_HEADER_DESCRIPTION + ' ' +
						CSS_PAGE_HEADER_DESCRIPTION_HIDE_BORDER + ' form-control"></textarea>' +
					'</div>',

					TPL_POPOVER_CONTENT: '<ul class="' + CSS_FORM_BUILDER_PAGE_POPOVER_CONTENT + '">' +
					'<li class="' + CSS_FORM_BUILDER_PAGE_MANAGER_ADD_PAGE_LAST_POSITION + '">{addPageLastPosition}</li>' +
					'<li class="' + CSS_FORM_BUILDER_PAGE_MANAGER_DELETE_PAGE + '">{deleteCurrentPage}</li>' +
					'<li class="' + CSS_FORM_BUILDER_PAGE_MANAGER_ADD_SUCCESS_PAGE + '">{addSuccessPage}</li>' +
					'<li class="' + CSS_FORM_BUILDER_PAGE_MANAGER_REMOVE_SUCCESS_PAGE + '">{removeSuccessPage}</li>' +
					'<li class="' + CSS_FORM_BUILDER_PAGE_MANAGER_SWITCH_MODE + '">{switchMode}</li>' +
					'</ul>',

					TPL_SUCCESS_PAGE: '<div class="' + CSS_FORM_BUILDER_SUCCESS_PAGE + '">' +
					'<label class="control-label">{title}</label><input class="' + CSS_FORM_BUILDER_SUCCESS_PAGE_TITLE + ' form-control" type="text"><br>' +
					'<label class="control-label">{description}</label><input class="' + CSS_FORM_BUILDER_SUCCESS_PAGE_DESCRIPTION + ' form-control" type="text">' +
					'</div>',

					initializer: function() {
						var instance = this;

						instance._eventHandlers = [
							A.on('windowresize', A.bind('_syncPageInformationHeight', instance)),
							instance.after('titlesChange', A.bind('_afterTitlesChange', instance))
						];

						var boundingBox = instance.get('builder').get('boundingBox');

						var content = boundingBox.one('.form-builder-content');

						var strings = instance.get('strings');

						var successPage = A.Node.create(
							A.Lang.sub(
								instance.TPL_SUCCESS_PAGE,
								{
									description: strings.description,
									title: strings.title
								}
							)
						);

						successPage.hide();

						content.append(successPage);
					},

					destructor: function() {
						var instance = this;

						(new A.EventHandle(instance._eventHandlers)).detach();
					},

					disablePaginations: function() {
						var instance = this;

						FormBuilderPagesManager.superclass.disablePaginations.apply(instance, arguments);

						instance._toggleWizardDisabled(true);
					},

					enablePaginations: function() {
						var instance = this;

						FormBuilderPagesManager.superclass.enablePaginations.apply(instance, arguments);

						instance._toggleWizardDisabled(false);
					},

					getSuccessPageDefinition: function() {
						var instance = this;

						var builder = instance.get('builder');

						var boundingBox = builder.get('boundingBox');

						var successPage = boundingBox.one('.' + CSS_FORM_BUILDER_SUCCESS_PAGE);

						var wizard = instance._getWizard();

						var successPageDefinition = {
							body: successPage.one('.' + CSS_FORM_BUILDER_SUCCESS_PAGE_DESCRIPTION).val(),
							enabled: wizard.get('successPage'),
							title: successPage.one('.' + CSS_FORM_BUILDER_SUCCESS_PAGE_TITLE).val()
						};

						return successPageDefinition;
					},

					setSuccessPage: function(successPageDefinition) {
						var instance = this;

						var builder = instance.get('builder');

						var boundingBox = builder.get('boundingBox');

						var successPage = boundingBox.one('.' + CSS_FORM_BUILDER_SUCCESS_PAGE);

						var wizard = instance._getWizard();

						if (successPageDefinition) {
							wizard.set('successPage', successPageDefinition.enabled);

							successPage.one('.' + CSS_FORM_BUILDER_SUCCESS_PAGE_DESCRIPTION).val(successPageDefinition.body);

							successPage.one('.' + CSS_FORM_BUILDER_SUCCESS_PAGE_TITLE).val(successPageDefinition.title);
						}
					},

					toggleControlsTriggerDisabled: function(disabled) {
						var instance = this;

						var builder = instance.get('builder');

						var boundingBox = builder.get('boundingBox');

						boundingBox.all('.' + CSS_FORM_BUILDER_CONTROLS_TRIGGER).toggleClass('disabled', disabled);
					},

					toggleDescriptionDisabled: function(disabled) {
						var instance = this;

						var descriptionNode = instance.get('pageHeader').one('.' + CSS_PAGE_HEADER_DESCRIPTION);

						instance._toggleNodeDisabled(descriptionNode, disabled);
					},

					toggleTitleDisabled: function(disabled) {
						var instance = this;

						var titleNode = instance.get('pageHeader').one('.' + CSS_PAGE_HEADER_TITLE);

						instance._toggleNodeDisabled(titleNode, disabled);
					},

					_addWizardPage: function() {
						var instance = this;

						var activePageNumber = instance.get('activePageNumber');

						var wizard = instance._getWizard();

						wizard.set('selected', activePageNumber - 1);
					},

					_afterPagesQuantityChange: function(event) {
						var instance = this;

						FormBuilderPagesManager.superclass._afterPagesQuantityChange.apply(instance, arguments);

						instance._syncControlTriggersUI();

						instance._uiSetMode(instance.get('mode'));

						var popover = instance._getPopover();

						var popoverBoundingBox = popover.get('boundingBox');

						var switchModeNode = popoverBoundingBox.one('.' + CSS_FORM_BUILDER_PAGE_MANAGER_SWITCH_MODE);

						switchModeNode.toggle(event.newVal > 1);
					},

					_afterTitlesChange: function(event) {
						var instance = this;

						instance._syncWizardItems();
					},

					_afterWizardSelectionChange: function() {
						var instance = this;

						var wizard = instance._getWizard();

						var selectedWizard = wizard.get('selected');

						var pagesQuantity = wizard.get('items').length;

						if (wizard.get('successPage') && selectedWizard === pagesQuantity) {
							instance._showSuccessPage();
						}
						else if (selectedWizard > -1) {
							instance._showLayout();
							var pagination = instance._getPagination();

							pagination.set('page', selectedWizard + 1);

							instance.set('activePageNumber', selectedWizard + 1);
						}
					},

					_createPopover: function() {
						var instance = this;

						var strings = instance.get('strings');

						var popover = new A.Popover(
							{
								bodyContent: A.Lang.sub(
									instance.TPL_POPOVER_CONTENT,
									{
										addPageLastPosition: strings.addPageLastPosition,
										addPageNextPosition: strings.addPageNextPosition,
										addSuccessPage: strings.addSuccessPage,
										deleteCurrentPage: this._getDeleteButtonString(),
										removeSuccessPage: strings.removeSuccessPage,
										switchMode: strings.switchMode
									}
								),
								constrain: true,
								cssClass: 'form-builder-page-manager-popover-header',
								visible: false,
								zIndex: 50
							}
						).render();

						var popoverBoundingBox = popover.get('boundingBox');

						popoverBoundingBox.one('.' + CSS_FORM_BUILDER_PAGE_MANAGER_ADD_PAGE_LAST_POSITION).on('click', A.bind('_onAddLastPageClick', instance));
						popoverBoundingBox.one('.' + CSS_FORM_BUILDER_PAGE_MANAGER_DELETE_PAGE).on('click', A.bind('_onRemovePageClick', instance));
						popoverBoundingBox.one('.' + CSS_FORM_BUILDER_PAGE_MANAGER_ADD_SUCCESS_PAGE).on('click', A.bind('_onAddSuccessClick', instance));
						popoverBoundingBox.one('.' + CSS_FORM_BUILDER_PAGE_MANAGER_REMOVE_SUCCESS_PAGE).on('click', A.bind('_onRemoveSuccessClick', instance));

						var switchModeNode = popoverBoundingBox.one('.' + CSS_FORM_BUILDER_PAGE_MANAGER_SWITCH_MODE);

						switchModeNode.on('click', A.bind('_onSwitchViewClick', instance));
						switchModeNode.toggle(instance.get('pagesQuantity') > 1);

						instance._renderControlTriggers(popover);
						instance._syncControlTriggersUI();

						return popover;
					},

					_createUntitledPageLabel: function(activePageNumber, pagesQuantity) {
						var instance = this;
						var title;

						var strings = instance.get('strings');

						title = A.Lang.sub(
							strings.untitledPage,
							[
								activePageNumber,
								pagesQuantity
							]
						);

						return title;
					},

					_createWizardItems: function() {
						var instance = this;

						var activePageNumber = instance.get('activePageNumber');
						var pagesQuantity = instance.get('pagesQuantity');
						var titles = instance.get('titles');

						var items = [];

						for (var i = 1; i <= pagesQuantity; i++) {
							var title = titles[i - 1];

							if (!title) {
								title = instance._createUntitledPageLabel(i, pagesQuantity);
							}

							items.push(
								{
									state: (activePageNumber === i) ? 'active' : '',
									title: title
								}
							);
						}

						return items;
					},

					_getWizard: function() {
						var instance = this;

						if (!instance.wizard) {
							var builder = instance.get('builder');

							var wizardNode = builder.get('boundingBox').one('.' + CSS_FORM_BUILDER_TABVIEW);

							instance.wizard = new Liferay.DDL.FormBuilderWizard(
								{
									after: {
										selectedChange: A.bind(instance._afterWizardSelectionChange, instance)
									},
									allowNavigation: true,
									boundingBox: wizardNode,
									items: instance._createWizardItems(),
									srcNode: wizardNode.one('> ul')
								}
							);
						}

						return instance.wizard;
					},

					_onAddLastPageClick: function() {
						var instance = this;

						instance._addPage();
						instance._addWizardPage();

						instance._getPopover().hide();
					},

					_onAddSuccessClick: function() {
						var instance = this;

						var wizard = instance._getWizard();

						wizard.set('successPage', true);

						instance._uiSetMode(instance.get('mode'));

						instance._showSuccessPage();

						instance._syncControlTriggersUI();

						instance._getPopover().hide();
					},

					_onPageControlOptionClick: function(event) {
						var popover = this._getPopover();

						event.stopPropagation();

						if (!event.currentTarget.hasClass('disabled')) {
							popover.set(
								'align',
								{
									node: event.currentTarget,
									points: [A.WidgetPositionAlign.RC, A.WidgetPositionAlign.TC]
								}
							);

							popover.set('position', event.currentTarget.getData('position'));

							popover.toggle();
						}
					},

					_onRemovePageClick: function() {
						var instance = this;

						var activePageNumber = instance.get('activePageNumber');

						var pagination = instance._getPagination();

						pagination.prev();

						instance.set('pagesQuantity', instance.get('pagesQuantity') - 1);

						instance.fire(
							'remove',
							{
								removedIndex: activePageNumber - 1
							}
						);

						var page = Math.max(1, activePageNumber - 1);

						pagination.getItem(page).addClass('active');

						var titles = instance.get('titles');

						titles.splice(activePageNumber - 1, 1);

						instance.set('titles', titles);
						instance.set('activePageNumber', page);

						instance._removeWizardPage(activePageNumber - 1);

						if (!instance.get('pagesQuantity')) {
							instance._addPage();
							instance._addWizardPage();

							instance._getWizard().activate(0);
						}
					},

					_onRemoveSuccessClick: function() {
						var instance = this;

						var wizard = instance._getWizard();

						wizard.set('successPage', false);

						instance._uiSetMode(instance.get('mode'));

						instance._syncControlTriggersUI();

						instance._showLayout();
					},

					_onSwitchViewClick: function() {
						var instance = this;

						instance._getPopover().hide();

						if (instance.get('mode') === 'pagination') {
							instance.set('mode', 'wizard');
						}
						else {
							instance.set('mode', 'pagination');
						}
					},

					_onTitleInputValueChange: function(event) {
						var instance = this;

						var activePageNumber = instance.get('activePageNumber');
						var titles = instance.get('titles');

						var title = event.newVal.trim();

						titles[activePageNumber - 1] = title;

						if (!title) {
							var pagesQuantity = instance.get('pagesQuantity');

							title = instance._createUntitledPageLabel(activePageNumber, pagesQuantity);
						}

						instance.set('titles', titles);
					},

					_plugAutoSize: function(node) {
						var instance = this;

						if (!node.autosize) {
							var height = node.get('scrollHeight');

							node.plug(A.Plugin.Autosize);
							node.height(height);
						}

						node.autosize._uiAutoSize();
					},

					_removeWizardPage: function(index) {
						var instance = this;

						var wizard = instance._getWizard();

						wizard._removeItem(index);

						instance._syncWizardItems();
					},

					_renderControlTriggers: function(popover) {
						var instance = this;

						var builder = instance.get('builder');

						var boundingBox = builder.get('boundingBox');

						var topControlTrigger = A.Lang.sub(
							instance.TPL_PAGE_CONTROL_TRIGGER,
							{
								position: 'top'
							}
						);

						var leftControlTrigger = A.Lang.sub(
							instance.TPL_PAGE_CONTROL_TRIGGER,
							{
								position: 'left'
							}
						);

						instance.get('pageHeader').one('.' + CSS_PAGE_HEADER).append(leftControlTrigger);

						boundingBox.one('.' + CSS_FORM_BUILDER_TABVIEW).append(topControlTrigger);
						boundingBox.one('.' + CSS_FORM_BUILDER_PAGINATION).append(leftControlTrigger);

						boundingBox.delegate('click', A.bind(instance._onPageControlOptionClick, instance), '.' + CSS_FORM_BUILDER_CONTROLS_TRIGGER);

						var controlsTriggerNodeList = boundingBox.all('.' + CSS_FORM_BUILDER_CONTROLS_TRIGGER);

						controlsTriggerNodeList.on('clickoutside', popover.hide, popover);

						instance._setCharacterLimitToPageTitle(100);
						instance._setCharacterLimitToPageDescription(120);
					},

					_renderTopPagination: function() {
						var instance = this;

						var wizard = instance._getWizard();

						wizard.render();
					},

					_setCharacterLimitToPageDescription: function(maxLength) {
						var instance = this;

						if (instance._charCounterPageDescription) {
							instance._charCounterPageDescription.set('maxLength', maxLength);
						}
						else {
							var pageHeader = instance.get('pageHeader').one('.' + CSS_PAGE_HEADER);

							instance._charCounterPageDescription = new A.CharCounter(
								{
									input: pageHeader.one('.' + CSS_PAGE_HEADER_DESCRIPTION),
									maxLength: maxLength
								}
							);
						}
					},

					_setCharacterLimitToPageTitle: function(maxLength) {
						var instance = this;

						if (instance._charCounterPageTitle) {
							instance._charCounterPageTitle.set('maxLength', maxLength);
						}
						else {
							var pageHeader = instance.get('pageHeader').one('.' + CSS_PAGE_HEADER);

							instance._charCounterPageTitle = new A.CharCounter(
								{
									input: pageHeader.one('.' + CSS_PAGE_HEADER_TITLE),
									maxLength: maxLength
								}
							);
						}
					},

					_showLayout: function() {
						var instance = this;

						var boundingBox = instance.get('builder').get('boundingBox');

						boundingBox.one('.' + CSS_LAYOUT).show();
						boundingBox.one('.' + CSS_PAGE_HEADER).show();

						boundingBox.one('.' + CSS_FORM_BUILDER_SUCCESS_PAGE).hide();
					},

					_showSuccessPage: function() {
						var instance = this;

						var boundingBox = instance.get('builder').get('boundingBox');

						boundingBox.one('.' + CSS_LAYOUT).hide();
						boundingBox.one('.' + CSS_PAGE_HEADER).hide();

						boundingBox.one('.' + CSS_FORM_BUILDER_SUCCESS_PAGE).show();
					},

					_syncControlTriggersUI: function() {
						var instance = this;

						var builder = instance.get('builder');
						var pageHeader = instance.get('pageHeader');
						var pagesQuantity = instance.get('pagesQuantity');

						var boundingBox = builder.get('boundingBox');

						var wizard = instance._getWizard();

						boundingBox.all('.' + CSS_FORM_BUILDER_CONTROLS_TRIGGER).toggle(pagesQuantity > 1 || wizard.get('successPage'));
						pageHeader.one('.' + CSS_FORM_BUILDER_CONTROLS_TRIGGER).toggle(pagesQuantity <= 1 && !wizard.get('successPage'));
					},

					_syncPageInformationHeight: function() {
						var instance = this;

						var pageHeader = instance.get('pageHeader');

						var pageDescription = pageHeader.one('.' + CSS_PAGE_HEADER_DESCRIPTION);
						var pageTitle = pageHeader.one('.' + CSS_PAGE_HEADER_TITLE);

						instance._plugAutoSize(pageDescription);
						instance._plugAutoSize(pageTitle);
					},

					_syncWizardItems: function() {
						var instance = this;

						var wizard = instance._getWizard();

						wizard.set('selected', instance.get('activePageNumber') - 1);
						wizard.set('items', instance._createWizardItems());
					},

					_toggleNodeDisabled: function(node, disabled) {
						if (disabled) {
							node.setAttribute('disabled', '');
						}
						else {
							node.removeAttribute('disabled');
						}
					},

					_toggleWizardDisabled: function(disabled) {
						var instance = this;

						instance._getWizard().set('disabled', disabled);
					},

					_uiSetActivePageNumber: function(event) {
						var instance = this;

						FormBuilderPagesManager.superclass._uiSetActivePageNumber.apply(instance, arguments);

						instance._syncPageInformationHeight();
					},

					_uiSetMode: function(type) {
						var instance = this;

						var pagination = instance._getPagination();
						var wizard = instance._getWizard();

						var paginationBoundingBox = pagination.get('boundingBox').get('parentNode');
						var wizardBoundingBox = wizard.get('boundingBox');

						if (instance.get('pagesQuantity') > 1 || wizard.get('successPage')) {
							if (type === 'wizard') {
								paginationBoundingBox.hide();
								wizardBoundingBox.show();

								instance._syncWizardItems();
							}
							else if (type === 'pagination') {
								paginationBoundingBox.show();
								wizardBoundingBox.hide();

								pagination.set('page', instance.get('activePageNumber'));
							}
						}
						else {
							paginationBoundingBox.hide();
							wizardBoundingBox.hide();
						}
					},

					_validateMode: function(mode) {
						return (mode === 'pagination' || mode === 'wizard');
					}
				}
			}
		);

		Liferay.namespace('DDL').FormBuilderPagesManager = FormBuilderPagesManager;
	},
	'',
	{
		requires: ['aui-autosize-deprecated', 'aui-char-counter', 'aui-form-builder-page-manager', 'liferay-ddl-form-builder-wizard']
	}
);