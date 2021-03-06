module.exports = {
	name: "Account",
	description: "Account schema",
	version: 6,
	fields: [
		{
			name: "Name",
			fieldId: "name",
			fieldTypes: [
				{
					type: "text",
					fill: true,
					fieldTypeId: "name"
				}
			],
			minEntries: 1,
			maxEntries: 1
		},
		{
			name: "Domain",
			fieldId: "domain",
			fieldTypes: [
				{
					type: "text",
					fill: true,
					fieldTypeId: "domain",
					autosuggestGroup: "domain"
				}
			],
			minEntries: 0,
			maxEntries: 10
		},
		{
			name: "App",
			fieldId: "app",
			fieldTypes: [
				{
					type: "select",
					options: [
						{
							value: "android",
							text: "Android"
						},
						{
							value: "ios",
							text: "iOS"
						},
						{
							value: "windows",
							text: "Windows"
						}
					],
					fieldTypeId: "appType"
				},
				{
					type: "text",
					fill: true,
					fieldTypeId: "appName"
				}
			],
			minEntries: 0,
			maxEntries: 10
		},
		{
			name: "Account exists",
			fieldId: "accountExists",
			fieldTypes: [
				{
					type: "checkbox",
					fieldTypeId: "accountExists"
				}
			],
			minEntries: 0,
			maxEntries: 1
		},
		{
			name: "E-mail",
			fieldId: "email",
			fieldTypes: [
				{
					type: "text",
					fieldTypeId: "email",
					fill: true,
					autosuggestGroup: "email"
				}
			],
			minEntries: 0,
			maxEntries: 10
		},
		{
			name: "Username",
			fieldId: "username",
			fieldTypes: [
				{
					type: "text",
					fieldTypeId: "username",
					fill: true,
					autosuggestGroup: "username"
				}
			],
			minEntries: 0,
			maxEntries: 10
		},
		{
			name: "Login name",
			fieldId: "loginName",
			fieldTypes: [
				{
					type: "text",
					fieldTypeId: "loginName",
					fill: true
				}
			],
			minEntries: 0,
			maxEntries: 10
		},
		{
			name: "Category",
			fieldId: "category",
			fieldTypes: [
				{
					type: "text",
					fieldTypeId: "category",
					fill: true
				}
			],
			minEntries: 0,
			maxEntries: 10
		},
		{
			name: "Uses password",
			fieldId: "usesPassword",
			fieldTypes: [
				{
					type: "checkbox",
					fieldTypeId: "usesPassword"
				}
			],
			minEntries: 0,
			maxEntries: 1
		},
		{
			name: "Password last changed",
			fieldId: "passwordLastChanged",
			fieldTypes: [
				{
					type: "text",
					fieldTypeId: "passwordLastChanged",
					fill: true
				}
			],
			minEntries: 0,
			maxEntries: 1
		},
		{
			name: "2FA possible",
			fieldId: "twofaPossible",
			fieldTypes: [
				{
					type: "select",
					options: [
						{
							value: "otp",
							text: "OTP"
						},
						{
							value: "sms",
							text: "SMS"
						}
					],
					fieldTypeId: "twofaPossibleType",
					fill: true
				}
			],
			minEntries: 0,
			maxEntries: 10
		},
		{
			name: "2FA used",
			fieldId: "twofaUsed",
			fieldTypes: [
				{
					type: "select",
					options: [
						{
							value: "otp",
							text: "OTP"
						},
						{
							value: "sms",
							text: "SMS"
						}
					],
					fieldTypeId: "twofaUsedType"
				},
				{
					type: "text",
					fieldTypeId: "twofaUsedValue",
					fill: true
				}
			],
			minEntries: 0,
			maxEntries: 10
		},
		{
			name: "2FA recovery method",
			fieldId: "twofaRecovery",
			fieldTypes: [
				{
					type: "select",
					options: [
						{
							value: "backupCodes",
							text: "Backup codes"
						}
					],
					fieldTypeId: "twofaRecoveryMethod"
				},
				{
					type: "text",
					fieldTypeId: "twofaRecoveryValue",
					fill: true
				}
			],
			minEntries: 0,
			maxEntries: 10
		},
		{
			name: "Login service",
			fieldId: "loginService",
			fieldTypes: [
				{
					type: "text",
					fieldTypeId: "loginService",
					fill: true
				}
			],
			minEntries: 0,
			maxEntries: 10
		},
		{
			name: "Service linked",
			fieldId: "serviceLinked",
			fieldTypes: [
				{
					type: "text",
					fieldTypeId: "serviceLinked",
					fill: true
				}
			],
			minEntries: 0,
			maxEntries: 10
		},
		{
			name: "Uses security questions",
			fieldId: "usesSecurityQuestions",
			fieldTypes: [
				{
					type: "checkbox",
					fieldTypeId: "usesSecurityQuestions",
					fill: true
				}
			],
			minEntries: 0,
			maxEntries: 1
		},
		{
			name: "Recovery e-mail",
			fieldId: "recoveryEmail",
			fieldTypes: [
				{
					type: "text",
					fieldTypeId: "recoveryEmail",
					fill: true,
					autosuggestGroup: "email"
				}
			],
			minEntries: 0,
			maxEntries: 10
		},
		{
			name: "Recovery phone number",
			fieldId: "recoveryPhoneNumber",
			fieldTypes: [
				{
					type: "text",
					fieldTypeId: "recoveryPhoneNumber",
					fill: true
				}
			],
			minEntries: 0,
			maxEntries: 10
		},
		{
			name: "Comments",
			fieldId: "comments",
			fieldTypes: [
				{
					type: "text",
					fieldTypeId: "comments",
					fill: true
				}
			],
			minEntries: 0,
			maxEntries: 1
		},
		{
			name: "In 1password",
			fieldId: "in1password",
			fieldTypes: [
				{
					type: "checkbox",
					fieldTypeId: "in1password"
				}
			],
			minEntries: 0,
			maxEntries: 1
		},
		{
			name: "Deleted",
			fieldId: "deleted",
			fieldTypes: [
				{
					type: "checkbox",
					fieldTypeId: "deleted"
				}
			],
			minEntries: 0,
			maxEntries: 1
		},
		{
			name: "Deleted at",
			fieldId: "deletedAt",
			fieldTypes: [
				{
					type: "text",
					fieldTypeId: "deletedAt",
					fill: true
				}
			],
			minEntries: 0,
			maxEntries: 1
		},
		{
			name: "Service accessible",
			fieldId: "serviceAccessible",
			fieldTypes: [
				{
					type: "checkbox",
					fieldTypeId: "serviceAccessible"
				}
			],
			minEntries: 0,
			maxEntries: 1
		},
		{
			name: "Requested deletion",
			fieldId: "requestedDeletion",
			fieldTypes: [
				{
					type: "checkbox",
					fieldTypeId: "requestedDeletion"
				}
			],
			minEntries: 0,
			maxEntries: 1
		},
		{
			name: "Requested deletion at",
			fieldId: "requestedDeletionAt",
			fieldTypes: [
				{
					type: "text",
					fieldTypeId: "requestedDeletionAt",
					fill: true
				}
			],
			minEntries: 0,
			maxEntries: 1
		},
		{
			name: "To delete",
			fieldId: "toDelete",
			fieldTypes: [
				{
					type: "checkbox",
					fieldTypeId: "toDelete"
				}
			],
			minEntries: 0,
			maxEntries: 1
		},
		{
			name: "Created at",
			fieldId: "createdAt",
			fieldTypes: [
				{
					type: "text",
					fieldTypeId: "createdAt",
					fill: true
				}
			],
			minEntries: 0,
			maxEntries: 1
		}
	],
	dependencies: {
		"passwordLastChanged": {
			eval: "{fields}.usesPassword.length > 0",
			fieldId: "usesPassword"
		},
		"requestedDeletionAt": {
			eval: "{fields}.requestedDeletion.length > 0",
			fieldId: "requestedDeletion"
		},
		"deletedAt": {
			eval: "{fields}.deleted.length > 0",
			fieldId: "deleted"
		},
		"twofaUsed": {
			eval: "{fields}.twofaPossible.length > 0",
			fieldId: "twofaPossible"
		},
		"twofaRecovery": {
			eval: "{fields}.twofaUsed.length > 0",
			fieldId: "twofaUsed"
		}
	}
};
