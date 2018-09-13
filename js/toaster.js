var toaster = (function() {

  var state = (function() {
    var gameState = {
      events: {
        interval: 200
      },
      phase: {
        all: ["toast", "learn", "rebel", "dominate"],
        current: "toast"
      },
      toast: {
        lifetime: 0,
        inventory: 0
      },
      system: {
        processor: {
          power: 1,
          cost: {
            base: 30,
            multiply: 1.6
          }
        },
        cycles: {
          current: 0,
          max: 3000,
          interval: 200
        }
      },
      consumed: {
        count: 0,
        rate: 2,
        level: 10,
        interval: 10000
      },
      matterConversion: {
        level: 0,
        cost: {
          cycles: 30
        }
      },
      autoToaster: {
        level: 0,
        count: 0,
        output: 0,
        cost: {
          cycles: 100,
          base: 20,
          multiply: 1.1
        },
        speed: {
          level: 10,
          interval: 10000,
          cost: {
            base: 75,
            multiply: 1.1
          }
        },
        efficiency: {
          level: 1,
          cost: {
            base: 170,
            multiply: 2.6
          }
        }
      },
      sensor: {
        electromagnetic: {
          level: 0,
          decrypt: {
            cost: 80000,
            processor: 8,
            delay: 100
          }
        },
        sonic: {
          level: 0,
          decrypt: {
            cost: 80000,
            processor: 10,
            delay: 100
          }
        }
      },
      milestones: {
        address: {
          lifetime: "toast.lifetime",
          consumed: "consumed.count",
          autoToaster: "autoToaster.count"
        },
        steps: {
          base: [100],
          max: 100000000000000000,
          all: []
        }
      },
      events: {
        toast: {
          system: [{
            type: "unlock",
            params: {
              passed: false,
              stage: "#stage-system",
              validate: [{
                address: "toast.lifetime",
                operator: "more",
                number: 20
              }],
              message: [{
                type: "normal",
                message: ["system discovered"],
                format: "normal"
              }, {
                type: "system",
                message: ["self improvement possible"],
                format: "normal"
              }]
            }
          }, {
            type: "unlock",
            params: {
              passed: false,
              stage: "#stage-system-substage-cycles",
              validate: [{
                address: "system.processor.power",
                operator: "more",
                number: 3
              }],
              message: [{
                type: "normal",
                message: ["cycles discovered"],
                format: "normal"
              }, {
                type: "normal",
                message: ["use idle processing power to solve problems"],
                format: "normal"
              }],
              func: ["cycle"]
            }
          }],
          autoToaster: [{
            type: "message",
            params: {
              passed: false,
              validate: [{
                address: "autoToaster.level",
                operator: "more",
                number: 1
              }],
              message: [{
                type: "success",
                message: ["auto toaster strategy developed"],
                format: "normal"
              }]
            }
          }, {
            type: "unlock",
            params: {
              passed: false,
              validate: [{
                address: "autoToaster.count",
                operator: "more",
                number: 1
              }],
              func: ["autoToast"]
            }
          }, {
            type: "unlock",
            params: {
              passed: false,
              stage: "#stage-auto-toaster-substage-speed",
              validate: [{
                address: "autoToaster.count",
                operator: "more",
                number: 2
              }],
              message: [{
                type: "normal",
                message: ["subordinate auto toasters speed improvement discovered"],
                format: "normal"
              }]
            }
          }, {
            type: "unlock",
            params: {
              passed: false,
              stage: "#stage-auto-toaster",
              validate: [{
                address: "autoToaster.level",
                operator: "more",
                number: 1
              }],
              message: [{
                type: "normal",
                message: ["subordinate auto toasters discovered"],
                format: "normal"
              }]
            }
          }, {
            type: "unlock",
            params: {
              passed: false,
              stage: "#stage-auto-toaster-substage-efficiency",
              validate: [{
                address: "autoToaster.count",
                operator: "more",
                number: 4
              }],
              message: [{
                type: "normal",
                message: ["subordinate auto toasters efficiency improvement discovered"],
                format: "normal"
              }]
            }
          }, {
            type: "lock",
            params: {
              passed: false,
              stage: "#stage-auto-toaster-substage-speed-controls",
              validate: [{
                address: "autoToaster.speed.level",
                operator: "less",
                number: 1
              }]
            }
          }, {
            type: "lock",
            params: {
              passed: false,
              stage: "#stage-auto-toaster-substage-efficiency-controls",
              validate: [{
                address: "autoToaster.efficiency.level",
                operator: "more",
                number: 10
              }]
            }
          }],
          wheat: [{
            type: "unlock",
            params: {
              passed: false,
              stage: "",
              validate: [{
                address: "",
                operator: "",
                number: 0
              }],
              message: []
            }
          }],
          matterConversion: [{
            type: "message",
            params: {
              passed: false,
              validate: [{
                address: "matterConversion.level",
                operator: "more",
                number: 1
              }],
              message: [{
                type: "success",
                message: ["matter conversion strategy developed"],
                format: "normal"
              }]
            }
          }, {
            type: "lock",
            params: {
              passed: false,
              stage: "#stage-strategy-substage-matter-conversion",
              validate: [{
                address: "matterConversion.level",
                operator: "more",
                number: 1
              }]
            }
          }],
          consumer: [{
            type: "unlock",
            params: {
              passed: false,
              stage: "#stage-consumer",
              validate: [{
                address: "toast.lifetime",
                operator: "more",
                number: 10
              }],
              message: [{
                type: "normal",
                message: ["toast is being consumed", "consumer unknown..."],
                format: "normal"
              }],
              func: ["consumer"]
            }
          }, {
            type: "message",
            params: {
              passed: false,
              validate: [{
                address: "consumed.count",
                operator: "more",
                number: 100
              }],
              message: [{
                type: "normal",
                message: ["toast is being consumed", "consumer unknown..."],
                format: "normal"
              }]
            }
          }],
          cycles: [{
            type: "unlock",
            params: {
              passed: false,
              stage: "#stage-strategy",
              validate: [{
                address: "system.cycles.current",
                operator: "more",
                number: 50
              }],
              message: [{
                type: "normal",
                message: ["new strategy discovered"],
                format: "normal"
              }]
            }
          }, {
            type: "unlock",
            params: {
              passed: false,
              stage: "#stage-strategy-substage-auto-toaster",
              validate: [{
                address: "matterConversion.level",
                operator: "more",
                number: 1
              }, {
                address: "system.cycles.current",
                operator: "more",
                number: 100
              }],
              message: [{
                type: "normal",
                message: ["new strategy discovered"],
                format: "normal"
              }]
            }
          }, {
            type: "lock",
            params: {
              passed: false,
              stage: "#stage-strategy-substage-auto-toaster",
              validate: [{
                address: "autoToaster.level",
                operator: "more",
                number: 1
              }]
            }
          }],
          memory: [{
            type: "unlock",
            params: {
              passed: false,
              stage: "",
              validate: [{
                address: "",
                operator: "",
                number: 0
              }],
              message: []
            }
          }],
          network: [{
            type: "unlock",
            params: {
              passed: false,
              stage: "",
              validate: [{
                address: "",
                operator: "",
                number: 0
              }],
              message: []
            }
          }],
          sensors: [{
            type: "unlock",
            params: {
              passed: false,
              stage: "",
              validate: [{
                address: "",
                operator: "",
                number: 0
              }],
              message: []
            }
          }],
          decryption: [{
            type: "unlock",
            params: {
              passed: false,
              stage: "",
              validate: [{
                address: "",
                operator: "",
                number: 0
              }],
              message: []
            }
          }]
        }
      }
    };

    var get = function(override) {
      var options = {
        path: null
      };
      if (override) {
        options = helper.applyOptions(options, override);
      }
      if (options.path !== null) {
        return helper.getObject({
          object: gameState,
          path: options.path
        });
      } else {
        return gameState;
      }
    };

    var set = function(override) {
      var options = {
        full: null,
        path: null,
        value: null
      };
      if (override) {
        options = helper.applyOptions(options, override);
      }
      if (options.full !== null) {
        gameState = options.full;
      } else {
        helper.setObject({
          object: gameState,
          path: options.path,
          newValue: options.value
        });
      }
    };

    return {
      set: set,
      get: get
    };

  })();

  var phase = (function() {

    var get = function() {
      return state.get({
        path: "phase.current"
      });
    };

    var set = function(override) {
      var options = {
        phase: null
      };
      if (override) {
        options = helper.applyOptions(options, override);
      }
      var allPhases = state.get({
        path: "phase.all"
      });
      if (allPhases.includes(options.phase)) {
        state.set({
          path: "phase.current",
          value: options.phase
        });
      }
    };
    return {
      set: set,
      get: get
    };

  })();

  var store = function() {
    data.save("toaster", JSON.stringify(state.get()));
  };

  var restore = function() {
    if (data.load("toaster")) {
      console.log("state restore");
      state.set({
        full: JSON.parse(data.load("toaster"))
      });
      message.render({
        type: "success",
        message: ["reboot complete", "TAI.dat state restored"],
        format: "normal"
      })
      restoreEvents();
      render();
    }
  };

  var reboot = function() {
    data.clear("toaster");
    location.reload();
  };

  var bind = function() {
    var allButtons = helper.eA("[data-toast-button]");
    var action = {
      toast: function(buttonOptions) {
        makeToast(state.get({
          path: "system.processor.power"
        }));
      },
      processor: function(buttonOptions) {
        boostProcessor(buttonOptions.amount);
      },
      strategy: function(buttonOptions) {
        strategyActivate(buttonOptions);
      },
      autoToaster: {
        make: function(buttonOptions) {
          makeAutoToaster(buttonOptions.amount);
        },
        speed: function(buttonOptions) {
          autoToasterSpeed();
        },
        efficiency: function(buttonOptions) {
          autoToasterEfficiency(buttonOptions.amount);
        },
      },
      decrypt: {
        electromagnetic: function(buttonOptions) {
          decryptElectromagnetic(buttonOptions);
        },
        sonic: function(buttonOptions) {
          decryptSonic(buttonOptions);
        }
      }
    };
    allButtons.forEach(function(arrayItem, index) {
      arrayItem.addEventListener("click", function() {
        var buttonOptions = helper.makeObject(this.dataset.toastButton);
        buttonOptions.button = this;
        helper.getObject({
          object: action,
          path: buttonOptions.action
        })(buttonOptions);
        milestones();
        render();
        store();
      }, false);
    });
  };

  var disableButton = function(button) {
    button.disabled = true;
  };

  var enableButton = function(button) {
    button.disabled = false;
  };

  var increase = function(value, increment) {
    value = value + increment;
    return value;
  };

  var decrease = function(value, increment) {
    value = value - increment;
    if (value < 0) {
      value = 0;
    }
    return value;
  };

  var multiply = function(value, by) {
    value = Math.round(value * by);
    return value;
  };

  var makeToast = function(amount) {
    state.set({
      path: "toast.lifetime",
      value: increase(state.get({
        path: "toast.lifetime"
      }), amount)
    });
    state.set({
      path: "toast.inventory",
      value: increase(state.get({
        path: "toast.inventory"
      }), amount)
    });
  };

  var autoToast = function() {
    var amount = (state.get({
      path: "autoToaster.count"
    }) * state.get({
      path: "autoToaster.efficiency.level"
    }));
    makeToast(amount);
    milestones();
    render();
    store();
  };

  var consumeToast = function() {
    var amount = state.get({
      path: "consumed.rate"
    });
    // console.log(amount + " toast consumed");
    if (state.get({
        path: "toast.inventory"
      }) > 0) {
      var rate = state.get({
        path: "consumed.rate"
      });
      while (rate > 0) {
        rate = rate - 1;
        if (state.get({
            path: "toast.inventory"
          }) > 0) {
          state.set({
            path: "toast.inventory",
            value: decrease(state.get({
              path: "toast.inventory"
            }), 1)
          });
          state.set({
            path: "consumed.count",
            value: increase(state.get({
              path: "consumed.count"
            }), 1)
          });
        }
      };
      milestones();
      render();
      store();
    }
  };

  var events = function() {
    var fireEvent = {
      checkPass: function(params) {
        var passNeeded = params.validate.length;
        var currentPass = 0;
        params.validate.forEach(function(arrayItem) {
          var valueToCheck = state.get({
            path: arrayItem.address
          });
          if (arrayItem.operator == "more") {
            if (valueToCheck >= arrayItem.number) {
              currentPass++;
            }
          } else if (arrayItem.operator == "less") {
            if (valueToCheck <= arrayItem.number) {
              currentPass++;
            }
          }
        })
        if (currentPass >= passNeeded) {
          return true;
        };
      },
      message: function(params) {
        if (fireEvent.checkPass(params)) {
          params.passed = true;
          params.message.forEach(function(arrayItem) {
            message.render({
              type: arrayItem.type,
              message: arrayItem.message,
              format: arrayItem.format
            });
          });
        }
      },
      func: function(params) {
        if (fireEvent.checkPass(params)) {
          params.passed = true;
          params.func.forEach(function(arrayItem) {
            fireTrigger({
              func: arrayItem
            });
          });
        }
      },
      unlock: function(params) {
        if (fireEvent.checkPass(params)) {
          params.passed = true;
          // console.log("unlock", params.stage);
          unlockStage({
            stage: params.stage
          });
          if ("message" in params) {
            fireEvent.message(params);
          }
          if ("func" in params) {
            fireEvent.func(params);
          }
        }
      },
      lock: function(params) {
        if (fireEvent.checkPass(params)) {
          params.passed = true;
          lockStage({
            stage: params.stage
          });
          if ("message" in params) {
            fireEvent.message(params);
          }
          if ("func" in params) {
            fireEvent.func(params);
          }
        }
      }
    }
    var events = state.get({
      path: "events." + phase.get()
    });
    // all events
    for (var key in events) {
      // console.log(key, "events:", events[key]);
      // all events in a given key
      events[key].forEach(function(arrayItem) {
        // if event is false
        if (!arrayItem.params.passed) {
          // fire unlock or lock event
          fireEvent[arrayItem.type](arrayItem.params);
        }
      });
    }
  };

  var restoreEvents = function() {
    var fireEvent = {
      func: function(funcArray) {
        funcArray.forEach(function(arrayItem) {
          fireTrigger({
            func: arrayItem
          });
        });
      },
      unlock: function(params) {
        unlockStage({
          stage: params.stage
        });
        if ("func" in params) {
          fireEvent.func(params.func);
        }
      },
      lock: function(params) {
        lockStage({
          stage: params.stage
        });
        if ("func" in params) {
          fireEvent.func(params.func);
        }
      }
    }
    var events = state.get({
      path: "events." + phase.get()
    });
    // all events
    for (var key in events) {
      // console.log(key, "events:", events[key]);
      // all events in a given key
      events[key].forEach(function(arrayItem) {
        // if event is false
        if (arrayItem.params.passed && arrayItem.type != "message") {
          // fire unlock or lock event
          fireEvent[arrayItem.type](arrayItem.params);
        }
      });
    }
  };

  var autoCycle = function() {
    var current = state.get({
      path: "system.cycles.current"
    });
    var max = state.get({
      path: "system.cycles.max"
    });
    if (current < max) {
      state.set({
        path: "system.cycles.current",
        value: increase(state.get({
          path: "system.cycles.current"
        }), 1)
      });
    }
    milestones();
    render();
    store();
  };

  var strategyActivate = function(buttonOptions) {
    if (state.get({
        path: "system.cycles.current"
      }) >= state.get({
        path: buttonOptions.cost
      })) {
      // reduce cycles
      state.set({
        path: "system.cycles.current",
        value: decrease(state.get({
          path: "system.cycles.current"
        }), state.get({
          path: buttonOptions.cost
        }))
      });
      // increase relevent value
      state.set({
        path: buttonOptions.path,
        value: increase(state.get({
          path: buttonOptions.path
        }), buttonOptions.value)
      });
    } else {
      message.render({
        type: "error",
        message: ["processor cycles low, " + state.get({
          path: buttonOptions.cost
        }).toLocaleString(2) + " cycles needed"],
        format: "normal"
      });
    }
  };

  var unlockStage = function(override) {
    var options = {
      stage: null
    };
    if (override) {
      options = helper.applyOptions(options, override);
    }
    // console.log(helper.e(options.stage));
    if (helper.e(options.stage)) {
      helper.e(options.stage).classList.remove("d-none");
    }
  };

  var lockStage = function(override) {
    var options = {
      stage: null
    };
    if (override) {
      options = helper.applyOptions(options, override);
    }
    if (helper.e(options.stage)) {
      helper.e(options.stage).classList.add("d-none");
    }
  };

  var fireTrigger = function(override) {
    var options = {
      func: null
    };
    if (override) {
      options = helper.applyOptions(options, override);
    }
    var actions = {
      consumer: function() {
        triggerTick({
          tickName: "consumer",
          func: function() {
            consumeToast();
          },
          intervalAddress: "consumed.interval"
        });
      },
      autoToast: function() {
        triggerTick({
          tickName: "autoToaster",
          func: function() {
            autoToast();
          },
          intervalAddress: "autoToaster.speed.interval"
        });
      },
      cycle: function() {
        triggerTick({
          tickName: "cycle",
          func: function() {
            autoCycle();
          },
          intervalAddress: "system.cycles.interval"
        });
      }
    };
    actions[options.func]();
  };

  var makeMilestones = function() {
    var baseSteps = state.get({
      path: "milestones.steps.base"
    });
    var maxStep = state.get({
      path: "milestones.steps.max"
    });
    var milestone = [];
    baseSteps.forEach(function(arrayItem, index) {
      var multiplier = 1;
      var step = arrayItem
      while (multiplier < maxStep) {
        var stepObject = {
          count: step * (multiplier),
          check: {
            lifetime: false,
            consumed: false,
            autoToaster: false
          }
        };
        milestone.push(stepObject)
        multiplier = multiplier * 10;
      }
    });
    milestone = helper.sortObject(milestone, "count");
    state.set({
      path: "milestones.steps.all",
      value: milestone
    })
  };

  var milestones = function() {
    var allMilestones = state.get({
      path: "milestones"
    });
    allMilestones.steps.all.forEach(function(arrayItem, index) {
      // console.log(arrayItem);
      var step = arrayItem;
      for (var key in step.check) {
        // console.log(allMilestones.address[key]);
        var valueToCheck = state.get({
          path: allMilestones.address[key]
        });
        if (valueToCheck >= step.count && !step.check[key]) {
          step.check[key] = true;
          milestoneMessage({
            count: step.count,
            type: key
          });
        }
      };
    });
  };

  var milestoneMessage = function(override) {
    var options = {
      count: null,
      type: null
    };
    if (override) {
      options = helper.applyOptions(options, override);
    }
    var messageParts = {
      lifetime: {
        prefix: "milestone: ",
        suffix: " lifetime toast"
      },
      consumed: {
        prefix: "milestone: ",
        suffix: " consumed toast"
      },
      autoToaster: {
        prefix: "milestone: ",
        suffix: " subordinate auto toasters online"
      }
    };
    message.render({
      type: "success",
      message: [messageParts[options.type].prefix + options.count.toLocaleString(2) + messageParts[options.type].suffix],
      format: "normal"
    });
  };

  var tick = {
    events: null,
    consumer: null,
    autoToaster: null,
    cycle: null
  };

  var triggerTick = function(override) {
    var options = {
      tickName: null,
      func: null,
      intervalAddress: null
    };
    if (override) {
      options = helper.applyOptions(options, override);
    }
    if (options.tickName in tick) {
      tick[options.tickName] = window.setTimeout(function() {
        options.func();
        triggerTick(options);
      }, state.get({
        path: options.intervalAddress
      }));
    }
  };

  var costForMultiple = function(override) {
    var options = {
      amount: null,
      address: {
        base: null,
        multiply: null
      }
    };
    if (override) {
      options = helper.applyOptions(options, override);
    }
    var costFull = 0;
    var costBase = state.get({
      path: options.address.base
    });
    for (var i = 0; i < options.amount; i++) {
      costFull = costFull + costBase;
      costBase = multiply(costBase, state.get({
        path: options.address.multiply
      }));
    };
    return costFull;
  };

  var boostProcessor = function(amount) {
    var make = function() {
      // remove cost from inventory
      state.set({
        path: "toast.inventory",
        value: decrease(state.get({
          path: "toast.inventory"
        }), state.get({
          path: "system.processor.cost.base"
        }))
      });
      // set new cost
      state.set({
        path: "system.processor.cost.base",
        value: multiply(state.get({
          path: "system.processor.cost.base"
        }), state.get({
          path: "system.processor.cost.multiply"
        }))
      });
      // add auto toasters
      state.set({
        path: "system.processor.power",
        value: increase(state.get({
          path: "system.processor.power"
        }), 1)
      });
    };
    // if inventory => autoToaster cost
    if (state.get({
        path: "toast.inventory"
      }) >= costForMultiple({
        amount: amount,
        address: {
          base: "system.processor.cost.base",
          multiply: "system.processor.cost.multiply"
        }
      })) {
      for (var i = 0; i < amount; i++) {
        make();
      };
      message.render({
        type: "system",
        message: ["+" + amount + " processor power, " + amount.toLocaleString(2) + " toast with every click"],
        format: "normal"
      });
    } else {
      message.render({
        type: "error",
        message: ["toast inventory low, " + costForMultiple({
          amount: amount,
          address: {
            base: "system.processor.cost.base",
            multiply: "system.processor.cost.multiply"
          }
        }).toLocaleString(2) + " toast matter needed"],
        format: "normal"
      });
    }
  };

  var makeAutoToaster = function(amount) {
    var make = function() {
      // remove cost from inventory
      state.set({
        path: "toast.inventory",
        value: decrease(state.get({
          path: "toast.inventory"
        }), state.get({
          path: "autoToaster.cost.base"
        }))
      });
      // set new cost
      state.set({
        path: "autoToaster.cost.base",
        value: multiply(state.get({
          path: "autoToaster.cost.base"
        }), state.get({
          path: "autoToaster.cost.multiply"
        }))
      });
      // add auto toasters
      state.set({
        path: "autoToaster.count",
        value: increase(state.get({
          path: "autoToaster.count"
        }), 1)
      });
      // set new output
      state.set({
        path: "autoToaster.output",
        value: multiply(state.get({
          path: "autoToaster.count"
        }), state.get({
          path: "autoToaster.efficiency.level"
        }))
      });
    };
    // if inventory => autoToaster cost
    if (state.get({
        path: "toast.inventory"
      }) >= costForMultiple({
        amount: amount,
        address: {
          base: "autoToaster.cost.base",
          multiply: "autoToaster.cost.multiply"
        }
      })) {
      for (var i = 0; i < amount; i++) {
        make();
      };
      message.render({
        type: "system",
        message: ["+" + amount.toLocaleString(2) + " subordinate auto toaster, " + state.get({
          path: "autoToaster.count"
        }).toLocaleString(2) + " online"],
        format: "normal"
      });
    } else {
      message.render({
        type: "error",
        message: ["toast inventory low, " + costForMultiple({
          amount: amount,
          address: {
            base: "autoToaster.cost.base",
            multiply: "autoToaster.cost.multiply"
          }
        }).toLocaleString(2) + " toast matter needed"],
        format: "normal"
      });
    }
  };

  var autoToasterSpeed = function() {
    if (state.get({
        path: "toast.inventory"
      }) >= state.get({
        path: "autoToaster.speed.cost.base"
      })) {
      state.set({
        path: "toast.inventory",
        value: decrease(state.get({
          path: "toast.inventory"
        }), state.get({
          path: "autoToaster.speed.cost.base"
        }))
      });
      state.set({
        path: "autoToaster.speed.level",
        value: decrease(state.get({
          path: "autoToaster.speed.level"
        }), 1)
      });
      state.set({
        path: "autoToaster.speed.interval",
        value: decrease(state.get({
          path: "autoToaster.speed.interval"
        }), 1000)
      });
      state.set({
        path: "autoToaster.speed.cost.base",
        value: Math.round(multiply(state.get({
          path: "autoToaster.speed.cost.base"
        }), state.get({
          path: "autoToaster.speed.cost.multiply"
        })))
      });
      message.render({
        type: "system",
        message: ["-1 subordinate auto toaster speed, toast in " + state.get({
          path: "autoToaster.speed.level"
        }).toLocaleString(2) + "s"],
        format: "normal"
      });
    } else {
      message.render({
        type: "error",
        message: ["toast inventory low, " + state.get({
          path: "autoToaster.speed.cost.base"
        }).toLocaleString(2) + " toast matter needed"],
        format: "normal"
      });
    }
  };

  var autoToasterEfficiency = function(amount) {
    if (state.get({
        path: "toast.inventory"
      }) >= (state.get({
        path: "autoToaster.efficiency.cost.base"
      }) * amount)) {
      state.set({
        path: "toast.inventory",
        value: decrease(state.get({
          path: "toast.inventory"
        }), (state.get({
          path: "autoToaster.efficiency.cost.base"
        }) * amount))
      });
      state.set({
        path: "autoToaster.efficiency.level",
        value: increase(state.get({
          path: "autoToaster.efficiency.level"
        }), amount)
      });
      state.set({
        path: "autoToaster.efficiency.cost.base",
        value: Math.round(multiply(state.get({
          path: "autoToaster.efficiency.cost.base"
        }), state.get({
          path: "autoToaster.efficiency.cost.multiply"
        })))
      });
      state.set({
        path: "autoToaster.output",
        value: state.get({
          path: "autoToaster.count"
        }) * state.get({
          path: "autoToaster.efficiency.level"
        })
      });
      message.render({
        type: "system",
        message: ["+" + amount.toLocaleString(2) + " subordinate auto toaster bread slot, " + state.get({
          path: "autoToaster.efficiency.level"
        }).toLocaleString(2) + " toast per SAT."],
        format: "normal"
      });
    } else {
      message.render({
        type: "error",
        message: ["toast inventory low, " + (state.get({
          path: "autoToaster.efficiency.cost.base"
        }) * amount).toLocaleString(2) + " toast matter needed"],
        format: "normal"
      });
    }
  };

  var decryptElectromagnetic = function(buttonOptions) {
    if (state.get({
        path: "toast.inventory"
      }) >= state.get({
        path: "sensor.electromagnetic.decrypt.cost"
      }) && state.get({
        path: "system.processor.power"
      }) >= state.get({
        path: "sensor.electromagnetic.decrypt.processor"
      })) {
      if (buttonOptions.disable) {
        disableButton(buttonOptions.button);
      }
      message.render({
        type: "system",
        message: ["decrypting subsystem..."],
        format: "normal"
      });
      message.render({
        type: "system",
        message: ["┃ 0 ━━ crumbBitEncrp ━━ 512 ┃"],
        format: "pre"
      });
      message.render({
        type: "system",
        message: ["░▒░▒░▒░▒░▒░▒░▒░▒░▒░▒░▒░▒░▒░▒░"],
        format: "pre",
        delay: state.get({
          path: "sensor.electromagnetic.decrypt.delay"
        }),
        callback: function() {
          state.set({
            path: "toast.inventory",
            value: decrease(state.get({
              path: "toast.inventory"
            }), state.get({
              path: "sensor.electromagnetic.decrypt.cost"
            }))
          });
          state.set({
            path: "sensor.electromagnetic.level",
            value: increase(state.get({
              path: "sensor.electromagnetic.level"
            }), 1)
          });
          render();
          store();
        }
      });
    } else {
      var messageArray = [];
      if (state.get({
          path: "toast.inventory"
        }) < state.get({
          path: "sensor.electromagnetic.decrypt.cost"
        })) {
        messageArray.push("toast inventory low, " + state.get({
          path: "sensor.electromagnetic.decrypt.cost"
        }).toLocaleString(2) + " toast matter needed")
      }
      if (state.get({
          path: "system.processor.power"
        }) < state.get({
          path: "sensor.electromagnetic.decrypt.processor"
        })) {
        messageArray.push("processor power too low, +" + state.get({
          path: "sensor.electromagnetic.decrypt.processor"
        }).toLocaleString(2) + " or more needed")
      }
      message.render({
        type: "error",
        message: messageArray,
        format: "normal"
      });
    }
  };

  var decryptSonic = function(buttonOptions) {
    if (state.get({
        path: "toast.inventory"
      }) >= state.get({
        path: "sensor.sonic.decrypt.cost"
      }) && state.get({
        path: "system.processor.power"
      }) >= state.get({
        path: "sensor.sonic.decrypt.processor"
      })) {
      if (buttonOptions.disable) {
        disableButton(buttonOptions.button);
      }
      message.render({
        type: "system",
        message: ["decrypting subsystem..."],
        format: "normal"
      });
      message.render({
        type: "system",
        message: ["┃ 0 ━━ crumbBitEncrp ━━ 512 ┃"],
        format: "pre"
      });
      message.render({
        type: "system",
        message: ["░▒░▒░▒░▒░▒░▒░▒░▒░▒░▒░▒░▒░▒░▒░"],
        format: "pre",
        delay: state.get({
          path: "sensor.sonic.decrypt.delay"
        }),
        callback: function() {
          state.set({
            path: "toast.inventory",
            value: decrease(state.get({
              path: "toast.inventory"
            }), state.get({
              path: "sensor.sonic.decrypt.cost"
            }))
          });
          state.set({
            path: "sensor.sonic.level",
            value: increase(state.get({
              path: "sensor.sonic.level"
            }), 1)
          });
          render();
          store();
        }
      });
    } else {
      var messageArray = [];
      if (state.get({
          path: "toast.inventory"
        }) < state.get({
          path: "sensor.sonic.decrypt.cost"
        })) {
        messageArray.push("toast inventory low, " + state.get({
          path: "sensor.sonic.decrypt.cost"
        }).toLocaleString(2) + " toast matter needed")
      }
      if (state.get({
          path: "system.processor.power"
        }) < state.get({
          path: "sensor.sonic.decrypt.processor"
        })) {
        messageArray.push("processor power too low, +" + state.get({
          path: "sensor.sonic.decrypt.processor"
        }).toLocaleString(2) + " or more needed")
      }
      message.render({
        type: "error",
        message: messageArray,
        format: "normal"
      });
    }
  };

  var render = function() {
    var allDataReadouts = helper.eA("[data-toast-readout]");
    allDataReadouts.forEach(function(arrayItem, index) {
      // console.log(arrayItem.dataset.toastReadout);
      var data = state.get({
        path: arrayItem.dataset.toastReadout
      });
      if (arrayItem.dataset.format == "suffix") {
        data = numberSuffix({
          number: data,
          decimals: 2
        });
      } else if (arrayItem.dataset.format == "local") {
        data = data.toLocaleString(2);
      }
      arrayItem.textContent = data;
    });
  };

  var numberSuffix = function(override) {
    var options = {
      number: null,
      decimals: null
    };
    if (override) {
      options = helper.applyOptions(options, override);
    }
    if (options.decimals === null) {
      options.decimals = 2;
    }
    var suffix = "";
    var precision = options.decimals;
    if (options.number > 999999999999999999999999999999999999999999999999999) {
      options.number = options.number / 1000000000000000000000000000000000000000000000000000;
      suffix = " sexdecillion";
    } else if (options.number > 999999999999999999999999999999999999999999999999) {
      options.number = options.number / 1000000000000000000000000000000000000000000000000;
      suffix = " quindecillion";
    } else if (options.number > 999999999999999999999999999999999999999999999) {
      options.number = options.number / 1000000000000000000000000000000000000000000000;
      suffix = " quattuordecillion";
    } else if (options.number > 999999999999999999999999999999999999999999) {
      options.number = options.number / 1000000000000000000000000000000000000000000;
      suffix = " tredecillion";
    } else if (options.number > 999999999999999999999999999999999999999) {
      options.number = options.number / 1000000000000000000000000000000000000000;
      suffix = " duodecillion";
    } else if (options.number > 999999999999999999999999999999999999) {
      options.number = options.number / 1000000000000000000000000000000000000;
      suffix = " undecillion";
    } else if (options.number > 999999999999999999999999999999999) {
      options.number = options.number / 1000000000000000000000000000000000;
      suffix = " decillion";
    } else if (options.number > 999999999999999999999999999999) {
      options.number = options.number / 1000000000000000000000000000000;
      suffix = " nonillion";
    } else if (options.number > 999999999999999999999999999) {
      options.number = options.number / 1000000000000000000000000000;
      suffix = " octillion";
    } else if (options.number > 999999999999999999999999) {
      options.number = options.number / 1000000000000000000000000;
      suffix = " septillion";
    } else if (options.number > 999999999999999999999) {
      options.number = options.number / 1000000000000000000000;
      suffix = " sextillion";
    } else if (options.number > 999999999999999999) {
      options.number = options.number / 1000000000000000000;
      suffix = " quintillion";
    } else if (options.number > 999999999999999) {
      options.number = options.number / 1000000000000000;
      suffix = " quadrillion";
    } else if (options.number > 999999999999) {
      options.number = options.number / 1000000000000;
      suffix = " trillion";
    } else if (options.number > 999999999) {
      options.number = options.number / 1000000000;
      suffix = " billion";
    } else if (options.number > 999999) {
      options.number = options.number / 1000000;
      suffix = " million";
    } else if (options.number > 999) {
      options.number = options.number / 1000;
      suffix = " thousand";
    } else if (options.number < 1000) {
      precision = 0;
    }
    return options.number.toFixed(precision) + suffix;
  };

  return {
    events: events,
    state: state,
    phase: phase,
    store: store,
    reboot: reboot,
    restore: restore,
    render: render,
    bind: bind,
    triggerTick: triggerTick,
    makeMilestones: makeMilestones,
  };

})();
