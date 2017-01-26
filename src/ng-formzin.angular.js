(function() {
    'use strict';

    angular
        .module('ngFormzin', [])
        .service('FormzinService', FormzinService)
        .directive('ngFormzin', FormzinDirective)
        .controller('DemoController', DemoController);

    DemoController.$inject = ["$scope"];
    function DemoController($scope) {
        var vm = this;
    }    

    FormzinService.$inject = [];    
    function FormzinService() {
        return {
            validate: function (val) {  
                if (val == "") {
                    return false;
                }
                
                return true;
            },
            validateEmail: function (email) {
                var pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                if (!pattern.test(email))
                    return false;

                return true;
            },
            validateUrl: function (url) {
                var pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
                if (pattern.test(url))
                    return true;
                else
                    return false;
            },
            validateCpf: function (cpf) {
                cpf = cpf.replace(/[^\d]+/g, '');

                if (cpf === '')
                    return false;

                if (cpf.length !== 11 ||
                        cpf === "00000000000" ||
                        cpf === "11111111111" ||
                        cpf === "22222222222" ||
                        cpf === "33333333333" ||
                        cpf === "44444444444" ||
                        cpf === "55555555555" ||
                        cpf === "66666666666" ||
                        cpf === "77777777777" ||
                        cpf === "88888888888" ||
                        cpf === "99999999999")
                    return false;

                var add = 0;
                for (var i = 0; i < 9; i ++)
                    add += parseInt(cpf.charAt(i)) * (10 - i);
                var rev = 11 - (add % 11);
                if (rev === 10 || rev === 11)
                    rev = 0;
                if (rev !== parseInt(cpf.charAt(9)))
                    return false;

                add = 0;
                for (var i = 0; i < 10; i ++)
                    add += parseInt(cpf.charAt(i)) * (11 - i);
                rev = 11 - (add % 11);
                if (rev === 10 || rev === 11)
                    rev = 0;
                if (rev !== parseInt(cpf.charAt(10)))
                    return false;

                return true;
            },
            validateCnpj: function (cnpj) {
                console.log("validando");
                cnpj = cnpj.replace(/[^\d]+/g, '');

                if (cnpj == '')
                    return false;

                if (cnpj.length != 14)
                    return false;

                // Elimina CNPJs invalidos conhecidos
                if (cnpj == "00000000000000" ||
                        cnpj == "11111111111111" ||
                        cnpj == "22222222222222" ||
                        cnpj == "33333333333333" ||
                        cnpj == "44444444444444" ||
                        cnpj == "55555555555555" ||
                        cnpj == "66666666666666" ||
                        cnpj == "77777777777777" ||
                        cnpj == "88888888888888" ||
                        cnpj == "99999999999999")
                    return false;

                // Valida DVs
                var tamanho = cnpj.length - 2
                var numeros = cnpj.substring(0, tamanho);
                var digitos = cnpj.substring(tamanho);
                var soma = 0;
                var pos = tamanho - 7;
                for (var i = tamanho; i >= 1; i--) {
                    soma += numeros.charAt(tamanho - i) * pos--;
                    if (pos < 2)
                        pos = 9;
                }
                var resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
                if (resultado != digitos.charAt(0))
                    return false;

                tamanho = tamanho + 1;
                numeros = cnpj.substring(0, tamanho);
                soma = 0;
                pos = tamanho - 7;
                for (var i = tamanho; i >= 1; i--) {
                    soma += numeros.charAt(tamanho - i) * pos--;
                    if (pos < 2)
                        pos = 9;
                }
                resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
                if (resultado != digitos.charAt(1))
                    return false;

                return true;
            },
            validateDate: function (v) {
                var currVal = v;
                if (currVal === '')
                    return false;

                var rxDatePattern = /^(\d{1,2})(\/|-)(\d{1,2})(\/|-)(\d{4})$/;
                var dtArray = currVal.match(rxDatePattern);

                if (dtArray === null)
                    return false;

                dtMonth = dtArray[3];
                dtDay = dtArray[1];
                dtYear = dtArray[5];

                if (dtMonth < 1 || dtMonth > 12)
                    return false;
                else if (dtDay < 1 || dtDay > 31)
                    return false;
                else if ((dtMonth === 4 || dtMonth === 6 || dtMonth === 9 || dtMonth === 11) && dtDay === 31)
                    return false;
                else if (dtMonth === 2)
                {
                    var isleap = (dtYear % 4 === 0 && (dtYear % 100 !== 0 || dtYear % 400 === 0));
                    if (dtDay > 29 || (dtDay === 29 && !isleap))
                        return false;
                }
                return true;
            },
            validadeCreditCard: function (s) {
                var v = "0123456789";
                var w = "";
                for (i = 0; i < s.length; i++) {
                    x = s.charAt(i);
                    if (v.indexOf(x, 0) !== -1)
                        w += x;
                }

                j = w.length / 2;
                k = Math.floor(j);
                m = Math.ceil(j) - k;
                c = 0;
                for (i = 0; i < k; i++) {
                    a = w.charAt(i * 2 + m) * 2;
                    c += a > 9 ? Math.floor(a / 10 + a % 10) : a;
                }
                for (i = 0; i < k + m; i++)
                    c += w.charAt(i * 2 + 1 - m) * 1;
                return (c % 10 === 0);
            },
            mask: function (obj, mask, skipMaskChars) {
                if (obj.val()) {
                    var trans = {
                        '0': {pattern: /\d/},
                        'A': {pattern: /[a-zA-Z0-9]/},
                        'S': {pattern: /[a-zA-Z]/}
                    };

                    var buf = [],
                            value = obj.val(),
                            m = 0, maskLen = mask.length,
                            v = 0, valLen = value.length,
                            offset = 1, addMethod = "push",
                            lastMaskChar,
                            check;

                    lastMaskChar = maskLen - 1;
                    check = function () {
                        return m < maskLen && v < valLen;
                    };

                    while (check()) {

                        var maskDigit = mask.charAt(m),
                                valDigit = value.charAt(v),
                                translation = trans[maskDigit];

                        if (translation) {
                            if (valDigit.match(translation.pattern)) {
                                buf[addMethod](valDigit);
                                m += offset;
                            } else if (translation.optional) {
                                m += offset;
                                v -= offset;
                            }
                            v += offset;
                        } else {
                            if (skipMaskChars === undefined) {
                                buf[addMethod](maskDigit);
                            }

                            if (valDigit === maskDigit) {
                                v += offset;
                            }

                            m += offset;
                        }
                    }

                    return buf.join("");
                } else {
                    return "";
                }
            },
            parsers: function(value, mask) {
                if (['cpf','cnpj','postcode','phone','creditCard','custom'].indexOf(mask) != -1) {
                    return value.replace(/[^0-9]/g, "");
                } else if (['date','datePtbr'].indexOf(mask) != -1) {
                    var date = value.replace(/[^0-9]/g, "");
                    
                    if (date.length == 8) {
                        return date.substring(4, 8) + "-" + date.substring(2, 4) + "-" + date.substring(0, 2);
                    }
                } else if (['dateEn'].indexOf(mask) != -1) {
                    var date = value.replace(/[^0-9]/g, "");
                    // 20000110
                    if (date.length == 8) {
                        return date.substring(0, 4) + "-" + date.substring(4, 6) + "-" + date.substring(6, 8);
                    }
                }

                return value;
            }   
        };    
    }

    FormzinDirective.$inject = ["$filter", "FormzinService"];    
    function FormzinDirective($filter, FormzinService) {
        return {
            require: "ngModel",
            restrict: 'A',
            scope: {},
            replace: false,
            link: function (scope, element, attrs, ctrl) {
                var masksFormat = { 
                    "cpf": "000.000.000-00",
                    "cnpj": "00.000.000/0000-00",
                    "postcode": "00000-000",
                    "phone": "(00) 0000-00000",
                    "creditCard": "0000 0000 0000 0000",
                    "int": "int",
                    "custom": "custom",
                    "uppercase": "uppercase",
                    "date": "date",
                    "datePtbr": "datePtbr",
                    "dateEn": "dateEn",
                    "carPlate": "SSS 0000",
                    "trackingCode": "SS000000000SS"
                };

                var fieldsValidate = { 
                    "cpf": FormzinService.validateCpf,
                    "cnpj": FormzinService.validateCnpj,
                    "postcode": FormzinService.validate,
                    "phone": FormzinService.validate,
                    "creditCard": FormzinService.validadeCreditCard,
                    "int": FormzinService.validate,
                    "date": FormzinService.validateDate,
                };

                var _attr = function(attr) {
                    if (element.attr(attr)) {
                        return element.attr(attr);
                    } else if (element.attr("data-" + attr)) {
                        return element.attr("data-" + attr);
                    } else if (element.attr("ng-" + attr)) {
                        return element.attr("ng-" + attr);
                    }

                    return null;
                }

                var _val = function() {
                    var mask = _attr('mask');
                    var val = element.val();
                    if (undefined !== masksFormat[mask]) {
                        var format = masksFormat[mask];
                        
                        if (format == 'datePtbr' || format == 'date') {
                            var separator = '/';
                            if (_attr('separator')) {
                                separator = _attr('separator');
                            }
                            format = "00" + separator + "00" + separator + "0000";
                        } else if (format == 'dateEn') {
                            var separator = '-';
                            if (_attr('separator')) {
                                separator = _attr('separator');
                            }
                            format = "0000" + separator + "00" + separator + "00";
                        }   

                        val = FormzinService.mask(element, format);
                    }

                    return val;
                }
                
                var _valid = function(val) {
                    var validade = _attr('validate');

                    if (undefined !== fieldsValidate[validade]) {
                        var valid = fieldsValidate[validade];
                        return valid(val);
                    }

                    return true;
                }
 
                // Aplicar a Mascara
                element.bind("keyup", function () {
                    var val = _val();
                    var valid = _valid(val);
                    var required = _attr('required');

                    if (required) {
                        ctrl.$setValidity(_attr('name'), valid);
                    }
                    ctrl.$setViewValue(val);
                    ctrl.$render();
                });

                ctrl.$parsers.push(function (value) {
                    if (_attr('parsers') != "false") {
                        return FormzinService.parsers(value, _attr('mask'));
                    }

                    return value;
                });
                

                ctrl.$formatters.push(function (value) {
                    return _val();
                });                                
            }
        };
    }
})();    