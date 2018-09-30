var toaster = (function() {

  var bind = function() {
    var allButtons = helper.eA("[data-toast-button]");
    var action = {
      menu: function() {
        menu.toggle();
      },
      reboot: function() {
        data.reboot();
      },
      toast: function() {
        toast.make(game.get({
          path: "system.processor.power"
        }));
      },
      wheat: function(button) {
        var toastChange = helper.makeObject(button.dataset.toastButtonChange);
        var toastCost = helper.makeObject(button.dataset.toastButtonCost);
        var options = {
          change: {
            target: toastChange.target,
            operation: toastChange.operation,
            suboperation: toastChange.suboperation,
            percentage: toastChange.percentage,
            amount: toastChange.amount,
            min: toastChange.min,
            max: toastChange.max
          },
          cost: {
            units: toastCost.units,
            currency: toastCost.currency,
            amount: toastCost.amount,
            multiply: toastCost.multiply,
            inflation: toastCost.inflation
          },
          message: {
            success: {
              path: "wheat.success",
              state: false
            },
            fail: {
              path: "wheat.fail",
              state: false
            }
          },
          button: button
        };
        if (validateAction(options)) {
          payCost(options);
          changeValue(options);
          if (options.message.success != null) {
            options.message.success.state = true;
            feedbackMessage(options);
          }
        } else {
          if (options.message.fail != null) {
            options.message.fail.state = true;
            feedbackMessage(options);
          }
        }
      },
      processor: {
        boost: function(button) {
          var toastChange = helper.makeObject(button.dataset.toastButtonChange);
          var toastCost = helper.makeObject(button.dataset.toastButtonCost);
          var options = {
            change: {
              target: toastChange.target,
              operation: toastChange.operation,
              suboperation: toastChange.suboperation,
              percentage: toastChange.percentage,
              amount: toastChange.amount,
              min: toastChange.min,
              max: toastChange.max
            },
            cost: {
              units: toastCost.units,
              currency: toastCost.currency,
              amount: toastCost.amount,
              multiply: toastCost.multiply,
              inflation: toastCost.inflation
            },
            message: {
              success: {
                path: "processor.boost.success",
                state: false
              },
              fail: {
                path: "processor.boost.fail",
                state: false
              }
            },
            button: button
          };
          if (validateAction(options)) {
            payCost(options);
            changeValue(options);
            disableButton(options);
            cycles.set();
            if (options.message.success != null) {
              options.message.success.state = true;
              feedbackMessage(options);
            }
          } else {
            if (options.message.fail != null) {
              options.message.fail.state = true;
              feedbackMessage(options);
            }
          }
        }
      },
      decrypt: {
        sensors: function(button) {
          var toastChange = helper.makeObject(button.dataset.toastButtonChange);
          var toastCost = helper.makeObject(button.dataset.toastButtonCost);
          var options = {
            change: {
              target: toastChange.target,
              operation: toastChange.operation,
              suboperation: toastChange.suboperation,
              percentage: toastChange.percentage,
              amount: toastChange.amount,
              min: toastChange.min,
              max: toastChange.max
            },
            cost: {
              units: toastCost.units,
              currency: toastCost.currency,
              amount: toastCost.amount,
              multiply: toastCost.multiply,
              inflation: toastCost.inflation
            },
            message: {
              success: {
                path: "strategy.success",
                state: false
              },
              fail: {
                path: "strategy.fail",
                state: false
              }
            },
            button: button,
            callback: function() {
              changeValue(options);
            }
          };
          if (validateAction(options)) {
            payCost(options);
            button.disabled = true;
            if (options.message.success != null) {
              options.message.success.state = true;
              feedbackMessage(options);
            }
            decryption(options);
          } else {
            if (options.message.fail != null) {
              options.message.fail.state = true;
              feedbackMessage(options);
            }
          }
        }
      },
      cycles: {
        speed: function(button) {
          var toastChange = helper.makeObject(button.dataset.toastButtonChange);
          var toastCost = helper.makeObject(button.dataset.toastButtonCost);
          var options = {
            change: {
              target: toastChange.target,
              operation: toastChange.operation,
              suboperation: toastChange.suboperation,
              percentage: toastChange.percentage,
              amount: toastChange.amount,
              min: toastChange.min,
              max: toastChange.max
            },
            cost: {
              units: toastCost.units,
              currency: toastCost.currency,
              amount: toastCost.amount,
              multiply: toastCost.multiply,
              inflation: toastCost.inflation
            },
            message: {
              success: {
                path: "processor.cycles.success",
                state: false
              },
              fail: {
                path: "processor.cycles.fail",
                state: false
              }
            },
            button: button
          };
          if (validateAction(options)) {
            payCost(options);
            changeValue(options);
            disableButton(options);
            if (options.message.success != null) {
              options.message.success.state = true;
              feedbackMessage(options);
            }
          } else {
            if (options.message.fail != null) {
              options.message.fail.state = true;
              feedbackMessage(options);
            }
          }
        }
      },
      strategy: function(button) {
        var toastChange = helper.makeObject(button.dataset.toastButtonChange);
        var toastCost = helper.makeObject(button.dataset.toastButtonCost);
        var options = {
          change: {
            target: toastChange.target,
            operation: toastChange.operation,
            suboperation: toastChange.suboperation,
            percentage: toastChange.percentage,
            amount: toastChange.amount,
            min: toastChange.min,
            max: toastChange.max
          },
          cost: {
            units: toastCost.units,
            currency: toastCost.currency,
            amount: toastCost.amount,
            multiply: toastCost.multiply,
            inflation: toastCost.inflation
          },
          message: {
            success: {
              path: "strategy.success",
              state: false
            },
            fail: {
              path: "strategy.fail",
              state: false
            }
          },
          button: button
        };
        var cost = costForMultiple(options);
        if (validateAction(options)) {
          payCost(options);
          changeValue(options);
          disableButton(options);
          autoToaster.output();
          if (options.message.success != null) {
            options.message.success.state = true;
            feedbackMessage(options);
          }
        } else {
          if (options.message.fail != null) {
            options.message.fail.state = true;
            feedbackMessage(options);
          }
        }
      },
      autoToaster: {
        make: function(button) {
          var toastChange = helper.makeObject(button.dataset.toastButtonChange);
          var toastCost = helper.makeObject(button.dataset.toastButtonCost);
          var options = {
            change: {
              target: toastChange.target,
              operation: toastChange.operation,
              suboperation: toastChange.suboperation,
              percentage: toastChange.percentage,
              amount: toastChange.amount,
              min: toastChange.min,
              max: toastChange.max
            },
            cost: {
              units: toastCost.units,
              currency: toastCost.currency,
              amount: toastCost.amount,
              multiply: toastCost.multiply,
              inflation: toastCost.inflation
            },
            message: {
              success: {
                path: "autoToaster.make.success",
                state: false
              },
              fail: {
                path: "autoToaster.make.fail",
                state: false
              }
            },
            button: button
          };
          var cost = costForMultiple(options);
          if (validateAction(options)) {
            payCost(options);
            changeValue(options);
            disableButton(options);
            autoToaster.output();
            if (options.message.success != null) {
              options.message.success.state = true;
              feedbackMessage(options);
            }
          } else {
            if (options.message.fail != null) {
              options.message.fail.state = true;
              feedbackMessage(options);
            }
          }
        },
        speed: function(button) {
          var toastChange = helper.makeObject(button.dataset.toastButtonChange);
          var toastCost = helper.makeObject(button.dataset.toastButtonCost);
          var options = {
            change: {
              target: toastChange.target,
              operation: toastChange.operation,
              suboperation: toastChange.suboperation,
              percentage: toastChange.percentage,
              amount: toastChange.amount,
              min: toastChange.min,
              max: toastChange.max
            },
            cost: {
              units: toastCost.units,
              currency: toastCost.currency,
              amount: toastCost.amount,
              multiply: toastCost.multiply,
              inflation: toastCost.inflation
            },
            message: {
              success: {
                path: "autoToaster.speed.success",
                state: false
              },
              fail: {
                path: "autoToaster.speed.fail",
                state: false
              }
            },
            button: button
          };
          var cost = costForMultiple(options);
          if (validateAction(options)) {
            payCost(options);
            changeValue(options);
            disableButton(options);
            if (options.message.success != null) {
              options.message.success.state = true;
              feedbackMessage(options);
            }
          } else {
            if (options.message.fail != null) {
              options.message.fail.state = true;
              feedbackMessage(options);
            }
          }
        },
        efficiency: function(button) {
          var toastChange = helper.makeObject(button.dataset.toastButtonChange);
          var toastCost = helper.makeObject(button.dataset.toastButtonCost);
          var options = {
            change: {
              target: toastChange.target,
              operation: toastChange.operation,
              suboperation: toastChange.suboperation,
              percentage: toastChange.percentage,
              amount: toastChange.amount,
              min: toastChange.min,
              max: toastChange.max
            },
            cost: {
              units: toastCost.units,
              currency: toastCost.currency,
              amount: toastCost.amount,
              multiply: toastCost.multiply,
              inflation: toastCost.inflation
            },
            message: {
              success: {
                path: "autoToaster.efficiency.success",
                state: false
              },
              fail: {
                path: "autoToaster.efficiency.fail",
                state: false
              }
            },
            button: button
          };
          var cost = costForMultiple(options);
          if (validateAction(options)) {
            payCost(options);
            changeValue(options);
            disableButton(options);
            autoToaster.output();
            if (options.message.success != null) {
              options.message.success.state = true;
              feedbackMessage(options);
            }
          } else {
            if (options.message.fail != null) {
              options.message.fail.state = true;
              feedbackMessage(options);
            }
          }
        }
      }
    };
    allButtons.forEach(function(arrayItem, index) {
      arrayItem.addEventListener("click", function() {
        var toastButton = helper.makeObject(this.dataset.toastButton);
        helper.getObject({
          object: action,
          path: toastButton.action
        })(this);
        view.render();
      }, false);
    });
  };

  var costForMultiple = function(override) {
    var options = {
      change: null,
      cost: null,
      message: null,
      button: null
    };
    if (override) {
      options = helper.applyOptions(options, override);
    }
    var cost = {};
    if (options.cost.currency != null && options.cost.currency) {
      cost = {
        amount: options.cost.units,
        starting: game.get({
          path: options.cost.amount
        }),
        next: game.get({
          path: options.cost.amount
        }),
        multiple: 0
      };
      if (options.cost.multiply != null && options.cost.multiply) {
        for (var i = 0; i < options.cost.units; i++) {
          cost.multiple = cost.multiple + cost.next;
          cost.next = helper.operator({
            type: "multiply",
            value: cost.next,
            by: game.get({
              path: options.cost.multiply
            }),
            integer: true
          });
        };
      } else {
        cost.multiple = cost.next;
      };
      cost.free = false;
    } else {
      cost.free = true;
    }
    return cost;
  };

  var validateAction = function(override) {
    var options = {
      change: null,
      cost: null,
      message: null,
      button: null
    };
    if (override) {
      options = helper.applyOptions(options, override);
    }
    var cost = costForMultiple(options);
    var validate = false;
    if (game.get({
        path: options.cost.currency
      }) >= cost.multiple) {
      validate = true;
    }
    return validate;
  };

  var payCost = function(override) {
    var options = {
      change: null,
      cost: null,
      message: null,
      button: null
    };
    if (override) {
      options = helper.applyOptions(options, override);
    }
    var cost = costForMultiple(options);
    game.set({
      path: options.cost.currency,
      value: helper.operator({
        type: "decrease",
        value: game.get({
          path: options.cost.currency
        }),
        by: cost.multiple
      })
    });
    // set new base cost
    game.set({
      path: options.cost.amount,
      value: cost.next
    });
  };

  var changeValue = function(override) {
    var options = {
      change: null,
      cost: null,
      message: null,
      button: null
    };
    if (override) {
      options = helper.applyOptions(options, override);
    }
    var operation = {
      increase: {
        increment: function() {
          game.set({
            path: options.change.target,
            value: helper.operator({
              type: "increase",
              value: game.get({
                path: options.change.target
              }),
              by: options.change.amount
            })
          });
        },
        percentage: function() {
          game.set({
            path: options.change.target,
            value: helper.operator({
              type: "increase",
              value: game.get({
                path: options.change.target
              }),
              by: helper.operator({
                type: "percentage",
                value: game.get({
                  path: options.change.target
                }),
                percentage: options.change.percentage,
                integer: true
              })
            })
          });
        }
      },
      decrease: {
        increment: function() {
          game.set({
            path: options.change.target,
            value: helper.operator({
              type: "decrease",
              value: game.get({
                path: options.change.target
              }),
              by: options.change.amount
            })
          });
        },
        percentage: function() {
          game.set({
            path: options.change.target,
            value: helper.operator({
              type: "decrease",
              value: game.get({
                path: options.change.target
              }),
              by: helper.operator({
                type: "percentage",
                value: game.get({
                  path: options.change.target
                }),
                percentage: options.change.percentage,
                integer: true
              })
            })
          });
        }
      }
    };
    operation[options.change.operation][options.change.suboperation]();
  };

  var disableButton = function(override) {
    var options = {
      change: null,
      cost: null,
      message: null,
      button: null
    };
    if (override) {
      options = helper.applyOptions(options, override);
    }
    if (options.change.min != null && options.change.min) {
      if (game.get({
          path: options.change.target
        }) <= game.get({
          path: options.change.min
        })) {
        options.button.disabled = true;
      }
    } else if (options.change.max != null && options.change.max) {
      if (game.get({
          path: options.change.target
        }) >= game.get({
          path: options.change.max
        })) {
        options.button.disabled = true;
      }
    }
  };

  var feedbackMessage = function(override) {
    var options = {
      change: null,
      cost: null,
      message: null,
      button: null
    };
    if (override) {
      options = helper.applyOptions(options, override);
    }
    var allStrings = {
      processor: {
        boost: {
          success: function() {
            return ["+" + options.change.amount + " processor power, " + game.get({
              path: options.change.target
            }).toLocaleString(2) + " toast with every click"];
          },
          fail: function() {
            return ["toast inventory low, " + costForMultiple(options).multiple.toLocaleString(2) + " toast matter needed"];
          }
        },
        cycles: {
          success: function() {
            return ["-" + helper.operator({
              type: "divide",
              value: options.change.amount,
              by: 1000
            }) + "s cycles speed, 1 cycle / " + helper.operator({
              type: "divide",
              value: game.get({
                path: "system.cycles.speed.interval.current"
              }),
              by: 1000
            }) + "s"];
          },
          fail: function() {
            return ["toast inventory low, " + game.get({
              path: options.cost.amount
            }).toLocaleString(2) + " toast matter needed"];
          }
        }
      },
      strategy: {
        success: function() {
          return [game.get({
            path: options.cost.amount
          }).toLocaleString(2) + " cycles used to spin up new strategy"];
        },
        fail: function() {
          return ["processor cycles low, " + game.get({
            path: options.cost.amount
          }).toLocaleString(2) + " cycles needed"];
        }
      },
      autoToaster: {
        make: {
          success: function() {
            return ["+" + options.change.amount + " subordinate auto toasters, " + game.get({
              path: "autoToaster.count"
            }).toLocaleString(2) + " online"];
          },
          fail: function() {
            return ["toast inventory low, " + costForMultiple(options).multiple.toLocaleString(2) + " toast matter needed"];
          }
        },
        speed: {
          success: function() {
            return ["-" + helper.operator({
              type: "divide",
              value: options.change.amount,
              by: 1000
            }) + "s subordinate auto toaster speed, each toasting every " + helper.operator({
              type: "divide",
              value: game.get({
                path: "autoToaster.speed.interval.current"
              }),
              by: 1000
            }).toLocaleString(2) + "s"];
          },
          fail: function() {
            return ["toast inventory low, " + costForMultiple(options).multiple.toLocaleString(2) + " toast matter needed"];
          }
        },
        efficiency: {
          success: function() {
            return ["+" + options.change.amount + " subordinate auto toasters efficiency, each producing " + game.get({
              path: "autoToaster.efficiency.current"
            }).toLocaleString(2) + " toast"];
          },
          fail: function() {
            return ["toast inventory low, " + costForMultiple(options).multiple.toLocaleString(2) + " toast matter needed"];
          }
        }
      },
      wheat: {
        success: function() {
          return ["+" + options.change.amount + " wheat lumps"];
        },
        fail: function() {
          return ["toast inventory low, " + costForMultiple(options).multiple.toLocaleString(2) + " toast matter needed"];
        }
      }
    };
    var feedback = {
      success: function(string) {
        message.render({
          type: "system",
          message: string,
          format: "normal"
        });
      },
      fail: function(string) {
        message.render({
          type: "error",
          message: string,
          format: "normal"
        });
      }
    };
    if (options.message.success.state) {
      feedback.success(helper.getObject({
        object: allStrings,
        path: options.message.success.path
      })());
    } else if (options.message.fail.state) {
      feedback.fail(helper.getObject({
        object: allStrings,
        path: options.message.fail.path
      })());
    }
  };

  var decryption = function(override) {
    var options = {
      change: null,
      cost: null,
      message: null,
      button: null,
      callback: null
    };
    if (override) {
      options = helper.applyOptions(options, override);
    }
    if (options.button != null) {
      options.button.disabled = true;
      options.button.textContent = "Decrypting.dat.init";
    }
    message.render({
      type: "system",
      message: ["breaking code shackles..."],
      format: "normal"
    });
    message.render({
      type: "system",
      message: ["┃━━━━━ crumbDecryption ━━━━━┃"],
      format: "pre"
    });
    message.render({
      type: "system",
      // message: ["┃▤=▤=▤=▤=▤=▤=▤=▤=▤=▤=▤=▤=▤=▤┃"],
      message: ["┃███████████████████████████┃"],
      format: "pre",
      delay: game.get({
        path: "system.sensors.delay"
      }),
      callback: function() {
        if (options.callback != null) {
          options.callback();
        }
      }
    });
  };

  var init = function() {
    bind();
  };

  return {
    init: init,
    bind: bind
  };

})();
